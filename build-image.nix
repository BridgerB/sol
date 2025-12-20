{
  pkgs ? import <nixpkgs> {system = "x86_64-linux";},
  serverBin,
  staticDir,
}:
pkgs.dockerTools.buildLayeredImage {
  name = "us-central1-docker.pkg.dev/altclock/cloud-run-source-deploy/sol";
  tag = "latest";
  contents = [
    pkgs.cacert
    pkgs.glibc
    pkgs.stdenv.cc.cc.lib # libgcc_s.so.1
  ];

  extraCommands = ''
    mkdir -p app/.deno-deploy/static
    cp ${serverBin} app/server
    chmod +x app/server
    cp -r ${staticDir}/* app/.deno-deploy/static/
  '';

  config = {
    Cmd = ["/app/server"];
    WorkingDir = "/app";
    Env = [
      "PORT=8080"
      "SSL_CERT_FILE=${pkgs.cacert}/etc/ssl/certs/ca-bundle.crt"
    ];
    ExposedPorts = {"8080/tcp" = {};};
  };
}
