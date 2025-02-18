import './js/wasm_exec_1_24.js';

// wasm モジュールを読み込み、インスタンスを返す
async function loadModule(): Promise<WebAssembly.Instance> {
  const go = new Go();
  const result = await WebAssembly.instantiateStreaming(
    fetch(new URL('./dist/main_1_24.wasm', import.meta.url)),
    go.importObject
  );
  const wasm = result.instance;
  go.run(wasm);
  return wasm;
}

function writeStringToMemory(wasm: WebAssembly.Instance, str: string): [number, number] {
  // JavaScript はデフォルトで UTF-16 形式で文字列を扱う
  // 今回は UTF-8 形式でやりとりしたいのでエンコードしておく
  let utf8str: Uint8Array = new TextEncoder().encode(str);

  // wasm モジュールは線形メモリを exports.memory として露出している
  // このメモリをやりとりに使う
  const memory = new Uint8Array(wasm.exports.mem.buffer);

  // TinyGo が export してくれる関数
  // 引数で指定したバイト数のメモリ領域を確保し、その先頭アドレスを返す
  const ptr: number = wasm.exports.malloc(utf8str.length);

  // 確保したメモリ領域に UTF-8 形式のバイト列を書き込む
  memory.set(utf8str, /* offset: */ ptr);

  // wasm モジュール側からも memory にアクセス可能なので
  // 書き込みが終わった後は memory への参照は手放していい

  // ポインタとバイト列の長さの組みを返す
  // この組みを wasm の関数に渡すことで文字列が書き込まれた領域を知らせる
  return [ptr, utf8str.length];
}

async function main() {
  const wasm = await loadModule();

  const str = 'Hello, 世界🌍';

  // 文字列を wasm の線形メモリに書き込む
  const [ptr, len] = writeStringToMemory(wasm, str);

  // ユーザー定義関数 `printString(ptr: i32, len: i32)` を呼び出す
  // ポインタとバイト列の長さの組みを渡すことで文字列を書き込んだ領域を知らせる
  wasm.exports.printString(ptr, len); // => Hello, 世界🌍
}

main();
