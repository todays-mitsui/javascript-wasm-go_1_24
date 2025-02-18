# JavaScript から wasm に文字列を渡す with Go 1.24

## 実行方法

wasm コンパイル

```sh
$ GOOS=js GOARCH=wasm go build -o dist/main_1_24.wasm ./main.go
```

TypeScript を実行

```sh
$ deno run --allow-read main.ts
Hello, 世界🌍
```

## バージョン

下記のバージョンで動作確認しています。

- Go: go1.24.0 darwin/arm64
- deno: 2.1.5 (stable, release, aarch64-apple-darwin)
  - v8 13.0.245.12-rusty
  - typescript 5.6.2
