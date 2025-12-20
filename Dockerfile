FROM nixos/nix

WORKDIR /app
COPY . .

RUN nix-channel --add https://nixos.org/channels/nixpkgs-unstable nixpkgs && nix-channel --update
RUN nix-shell -p deno --run "deno install --allow-scripts && deno task build"

ENV PORT=8080
EXPOSE 8080

CMD ["nix-shell", "-p", "deno", "--run", "deno run -A start.ts"]
