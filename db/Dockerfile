FROM amacneil/dbmate:latest

COPY migrations migrations

CMD ["--migrations-dir=migrations", "--wait-timeout 20s", "up"]
