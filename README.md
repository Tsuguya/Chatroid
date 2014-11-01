# Chatroid
ChatWorkへの自動投稿をお助けするWebアプリケーションです。

# インストール

## meteor のインストール

````
$ curl https://install.meteor.com/ | sh
````

## Chatroid のインストール

````
$ git clone https://github.com/Tsuguya/Chatroid.git
````

## 環境変数の設定
ChatWorkのAPIへアクセスするためのアクセストークンを環境変数に設定します。
ChatWorkAPIのアクセストークン取得方法は[こちら](http://developer.chatwork.com/ja/authenticate.html)を参照して下さい。

このレポジトリのトップディレクトリに.envファイルを作成し、環境変数を設定します。

````
$ cd Chatroid
$ touch .env
$ echo CHATWORK_ACCESS_TOKEN="チャットワークのアクセストークン" >> .env
````

## Chatroid の起動
下記のコマンドで起動します。

````
$ meteor run
````
