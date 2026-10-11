FROM python:3.12-slim-bookworm

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY check_freshness.py /opt/examtree/check_freshness.py
USER 65532:65532
ENTRYPOINT ["python3", "/opt/examtree/check_freshness.py"]
