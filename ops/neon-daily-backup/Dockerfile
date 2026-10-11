FROM postgres:17-bookworm

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates curl gnupg python3 \
    && rm -rf /var/lib/apt/lists/*

COPY backup.sh /usr/local/bin/examtree-neon-daily-backup
RUN chmod 0555 /usr/local/bin/examtree-neon-daily-backup

USER postgres
ENTRYPOINT ["/usr/local/bin/examtree-neon-daily-backup"]
