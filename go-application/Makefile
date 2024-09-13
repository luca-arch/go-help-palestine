SHELL:=/bin/bash
GCI_LINT:=v1.60.3


help: ### Display this help screen
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)
.PHONY: help


cover: ### Collect code coverage
	go test -coverprofile=coverage.out ./...;
	go tool cover -html=coverage.out;
.PHONY: cover


docs: ### Generate documentation files
	docker run --rm -v $(CURDIR):/mnt/go-help-palestine -w /mnt/go-help-palestine \
		--publish '127.0.0.1:8080:8080' \
		golang:alpine \
		sh -c 'go install golang.org/x/pkgsite/cmd/pkgsite@latest && pkgsite -http=0.0.0.0:8080';
.PHONY: docs


lint: ### Run go fmt and golangci-lint
	go fmt ./...;
	docker run --rm -t -v $(CURDIR):/mnt -w /mnt golangci/golangci-lint:$(GCI_LINT) \
		golangci-lint run --allow-parallel-runners;
.PHONY: lint


test: ### Run unit tests
	go test ./...;
.PHONY: test