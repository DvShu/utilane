type SnowflakeIDInfo = {
  value: string;
  timeOffset: bigint;
  timestamp: number;
  machineId: bigint;
  sequence: bigint;
  epoch: number;
  version: string | undefined;
};

type SnowflakeIDState = {
  lastTimestamp: bigint;
  sequence: bigint;
};

/** 雪花ID, 推荐在全局构造一个对象用于生成id */
export class SnowflakeID {
  private static readonly SEQUENCE_MASK = 0xfffn;
  private static readonly TIMESTAMP_MASK = 0x1ffffffffffn;
  private static readonly MACHINE_MASK = 0x3ffn;
  private static readonly SHIFT_TIMESTAMP = 22n;
  private static readonly SHIFT_MACHINE = 12n;
  private static readonly MAX_MACHINE_ID = 1023;
  private static readonly DEFAULT_MAX_CLOCK_TOLERANCE = 5;
  private static readonly MAX_ID = (1n << 63n) - 1n;
  private static readonly STATES = new Map<string, SnowflakeIDState>();

  /** 机器码, 默认为: 1 */
  public readonly machineId: bigint;
  /** 起始时间戳, 默认为：1288834974657 */
  public readonly epoch: bigint;
  /** 版本号, 默认为: 0 */
  private _version = 0;
  /** 允许的最大时钟回拨毫秒数, 默认为: 5 */
  public readonly maxClockTolerance: number;
  private readonly _state: SnowflakeIDState;

  /**
   * 构造函数
   *
   * @param machineId 机器标识，默认为1
   * @param epoch 时间戳起始值，默认为1288834974657
   * @param maxClockTolerance 允许的最大时钟回拨毫秒数，默认为5
   */
  public constructor(
    machineId: number = 1,
    epoch: number = 1288834974657,
    maxClockTolerance: number = SnowflakeID.DEFAULT_MAX_CLOCK_TOLERANCE,
  ) {
    if (
      !Number.isSafeInteger(machineId) ||
      machineId < 0 ||
      machineId > SnowflakeID.MAX_MACHINE_ID
    ) {
      throw new Error(
        `machineId must be a safe integer between 0 and ${SnowflakeID.MAX_MACHINE_ID}, got ${machineId}`,
      );
    }
    if (!Number.isSafeInteger(epoch) || epoch < 0 || epoch > Date.now()) {
      throw new Error(
        `epoch must be a non-negative safe integer not later than the current time, got ${epoch}`,
      );
    }
    if (!Number.isSafeInteger(maxClockTolerance) || maxClockTolerance < 0) {
      throw new Error(
        `maxClockTolerance must be a non-negative safe integer, got ${maxClockTolerance}`,
      );
    }
    this.machineId = BigInt(machineId);
    this.epoch = BigInt(epoch);
    this.maxClockTolerance = maxClockTolerance;
    const stateKey = `${this.epoch}:${this.machineId}`;
    let state = SnowflakeID.STATES.get(stateKey);
    if (state == null) {
      state = { lastTimestamp: 0n, sequence: 0n };
      SnowflakeID.STATES.set(stateKey, state);
    }
    this._state = state;
  }

  public get version(): number {
    return this._version;
  }

  public set version(version: number) {
    if (!Number.isInteger(version) || version < 0 || version > 9) {
      throw new Error(`version must be an integer between 0 and 9, got ${version}`);
    }
    this._version = version;
  }

  /**
   * 生成雪花ID
   *
   * @returns 返回生成的唯一ID字符串
   * @throws 如果时钟回拨超过容差阈值，抛出错误
   */
  public generate(): string {
    let cTimestamp = BigInt(Date.now());
    if (cTimestamp < this._state.lastTimestamp) {
      const drift = Number(this._state.lastTimestamp - cTimestamp);
      if (drift > this.maxClockTolerance) {
        throw new Error(
          `Clock moved backwards by ${drift}ms (tolerance: ${this.maxClockTolerance}ms)`,
        );
      }
      cTimestamp = this._state.lastTimestamp;
    }
    let sequence: bigint;
    if (cTimestamp === this._state.lastTimestamp) {
      // 雪花id，末尾: 12位序列号(二进制12个1等于16进制4095)，最多4096个(从0到4095)
      sequence = (this._state.sequence + 1n) & SnowflakeID.SEQUENCE_MASK;
      if (sequence === 0n) {
        // 使用下一逻辑毫秒，避免同步忙等阻塞 JavaScript 事件循环
        cTimestamp += 1n;
      }
    } else {
      sequence = 0n;
    }
    const timeDiff = cTimestamp - this.epoch;
    if (timeDiff < 0n || timeDiff > SnowflakeID.TIMESTAMP_MASK) {
      throw new Error(
        `Timestamp offset must be between 0 and ${SnowflakeID.TIMESTAMP_MASK}, got ${timeDiff}`,
      );
    }
    this._state.lastTimestamp = cTimestamp;
    this._state.sequence = sequence;
    const id =
      (timeDiff << SnowflakeID.SHIFT_TIMESTAMP) |
      (this.machineId << SnowflakeID.SHIFT_MACHINE) |
      sequence;
    const idstr = id.toString().padStart(19, "0");
    return `${this.version}${idstr}`;
  }

  public parse(snowflakeID: string, epoch?: number, includeVersion = true): SnowflakeIDInfo {
    if (typeof snowflakeID !== "string" || !/^\d+$/.test(snowflakeID)) {
      throw new Error("snowflakeID must be a non-empty decimal string");
    }
    let version: string | undefined;
    if (includeVersion) {
      if (snowflakeID.length < 2) {
        throw new Error("snowflakeID must contain a version and an ID value");
      }
      version = snowflakeID.substring(0, 1);
      snowflakeID = snowflakeID.substring(1);
    }
    const epochTime = epoch ?? Number(this.epoch);
    if (!Number.isSafeInteger(epochTime) || epochTime < 0) {
      throw new Error(`epoch must be a non-negative safe integer, got ${epochTime}`);
    }
    const id = BigInt(snowflakeID);
    if (id > SnowflakeID.MAX_ID) {
      throw new Error(`snowflakeID value exceeds the 63-bit Snowflake range`);
    }
    // 1FFFFFFFFFF 就是二进制的41个1, 雪花id前面41位为时间戳间隔
    const timeDiff = (id >> SnowflakeID.SHIFT_TIMESTAMP) & SnowflakeID.TIMESTAMP_MASK;
    const flowTime = Number(timeDiff) + epochTime;
    if (!Number.isSafeInteger(flowTime)) {
      throw new Error("Parsed timestamp exceeds the JavaScript safe integer range");
    }
    // 雪花id中间10位为机器标识, 0x3FF(二进制10个1) 进行位运算
    const machineId = (id >> SnowflakeID.SHIFT_MACHINE) & SnowflakeID.MACHINE_MASK;
    const sequence = id & SnowflakeID.SEQUENCE_MASK;
    return {
      value: snowflakeID,
      timeOffset: timeDiff,
      timestamp: flowTime,
      machineId: machineId,
      sequence: sequence,
      epoch: epochTime,
      version: version,
    };
  }
}

/** 将uuid转换为更简单的唯一标记id */
export class ShortUUID {
  private alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  /**
   * 构造函数，用于初始化字母表
   * @param {string} [alphabet] - 可选参数，用于指定自定义字母表
   * 如果提供了alphabet参数，则将其设置为实例的字母表属性
   * 如果未提供alphabet参数，则使用默认值
   */
  public constructor(alphabet?: string) {
    if (alphabet) {
      this.alphabet = alphabet;
    }
  }
  /**
   * 将UUID字符串进行编码处理
   * @param uuid - 需要编码的UUID字符串
   * @returns 编码后的字符串；全零 UUID 返回字符表的首字符
   */
  public encode(uuid: string, alphabet?: string): string {
    // 将UUID字符串转换为整数
    const uuidInt = this._uuidHexToInt(uuid);
    // 将整数转换为特定格式的字符串
    return this._intToString(uuidInt, alphabet);
  }
  /**
   * 解码短UUID字符串，将其转换为UUID整数和十六进制格式
   * @param shortUUID - 需要解码的短UUID字符串
   * @returns UUID 整数及补齐前导零的小写标准 UUID 字符串
   */
  public decode(
    shortUUID: string,
    alphabet?: string,
  ): {
    uuidInt: bigint;
    uuid: string;
  } {
    const uuidInt = this._stringToInt(shortUUID, alphabet);
    return {
      uuidInt: uuidInt,
      uuid: this._uuidIntToHex(uuidInt),
    };
  }

  private _stringToInt(str: string, alphabet?: string): bigint {
    if (!alphabet) alphabet = this.alphabet;
    const alphabetlen = BigInt(alphabet.length);
    let result = BigInt(0);
    let multiplier = BigInt(1);
    const strlen = str.length;
    for (let i = strlen - 1; i >= 0; i--) {
      const char = str[i];
      const index = alphabet.indexOf(char);
      if (index === -1) {
        throw new Error(`Character "${char}" not found in alphabet`);
      }
      result += BigInt(index) * multiplier;
      multiplier *= alphabetlen;
    }
    return result;
  }

  private _intToString(uuidInt: bigint, alphabet?: string) {
    if (!alphabet) alphabet = this.alphabet;
    if (uuidInt === 0n) return alphabet.charAt(0);
    const alphabetlen = BigInt(alphabet.length);
    let num = uuidInt;
    const result = [];
    // uuidInt = d₀ × 1(base的0次方) + d₁ × base + d₂ × base²...
    while (num) {
      const index = Number(num % alphabetlen);
      num = num / alphabetlen;
      result.push(alphabet.charAt(index));
    }
    // 倒序，保证高位在前
    return result.reverse().join("");
  }

  private _uuidHexToInt(uuid: string) {
    const uuidHex = uuid.replaceAll("-", "");
    return BigInt(`0x${uuidHex}`);
  }

  private _uuidIntToHex(uuidInt: bigint) {
    // BigInt 不保留前导零，恢复固定的 128 位 UUID（32 个十六进制字符）。
    const uuidHexStr = uuidInt.toString(16).padStart(32, "0");
    if (!/^[0-9a-fA-F]{32}$/.test(uuidHexStr)) {
      throw new Error("Invalid UUID string (must be 32 hex characters)");
    }

    return [
      uuidHexStr.slice(0, 8),
      uuidHexStr.slice(8, 12),
      uuidHexStr.slice(12, 16),
      uuidHexStr.slice(16, 20),
      uuidHexStr.slice(20),
    ].join("-");
  }
}
