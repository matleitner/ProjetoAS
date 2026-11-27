#!/usr/bin/env bash
set -euo pipefail

DATADIR="${MYSQL_DATADIR:-/tmp/opencode/mysql-data}"
SOCKET="${MYSQL_SOCKET:-/tmp/opencode/mysql.sock}"
PIDFILE="${MYSQL_PIDFILE:-/tmp/opencode/mysql.pid}"
PORT="${MYSQL_PORT:-3306}"
USER_NAME="$(id -un)"

mkdir -p "$(dirname "$DATADIR")" "$(dirname "$SOCKET")"

if [ ! -d "$DATADIR/mysql" ]; then
  mkdir -p "$DATADIR"
  mysqld --initialize-insecure --user="$USER_NAME" --datadir="$DATADIR" --log-error="$DATADIR/init.err"
fi

if ! mysqladmin --protocol=socket --socket="$SOCKET" -u root ping >/dev/null 2>&1; then
  rm -f "$SOCKET" "$PIDFILE"
  mysqld --user="$USER_NAME" --datadir="$DATADIR" --socket="$SOCKET" --port="$PORT" \
    --bind-address=127.0.0.1 --pid-file="$PIDFILE" --log-error="$DATADIR/server.err" --daemonize
fi

until mysqladmin --protocol=socket --socket="$SOCKET" -u root ping >/dev/null 2>&1; do
  sleep 0.2
done

npm run db:setup
npm run db:reset
