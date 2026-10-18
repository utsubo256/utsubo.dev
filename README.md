Zolaのバージョンは `mise.toml` で指定します。

```sh
mise install zola
mise exec -- zola serve
mise exec -- zola check --skip-external-links
mise exec -- zola build
```

バージョンを更新するときは、Cloudflare PagesのProduction・Preview両方の `ZOLA_VERSION` も揃えてください。Previewでビルドと表示を確認してから、Productionの設定変更とマージを行います。
