FROM ghcr.io/foundry-rs/foundry:latest

RUN apk add --no-cache bash

WORKDIR /sandbox

COPY entrypoint.sh /entrypoint.sh
COPY foundry.toml /sandbox/foundry.toml

RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]