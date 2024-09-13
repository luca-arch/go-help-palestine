# Golang app builder
FROM golang:1.23.0-alpine3.20 AS builder

WORKDIR /mnt/src

COPY go.mod go.sum ./
RUN go mod download

COPY cmd cmd/
COPY crawler crawler/
COPY models models/
COPY telegram telegram/
COPY webserver webserver/
RUN go build -o go-help-palestine ./cmd/server/main.go


# Golang app runner
FROM alpine:3.20.2

ENV GOMAXPROCS="1"
ENV ISDOCKER="1"
COPY --from=builder /mnt/src/go-help-palestine /srv/go-help-palestine

EXPOSE 10000

VOLUME [ "/mnt/data" ]

ENTRYPOINT [ "/srv/go-help-palestine" ]