{
  pkgs ? import <nixpkgs> {system = "x86_64-linux";},
  serverBin,
  staticDir,
}:
pkgs.dockerTools.buildLayeredImage {
  name = "us-central1-docker.pkg.dev/altclock/cloud-run-source-deploy/sol";
  tag = "latest";
  contents = [pkgs.cacert];

  extraCommands = ''
    mkdir -p app/static
    cp ${serverBin} app/server
    chmod +x app/server
    cp -r ${staticDir}/* app/static/
  '';

  config = {
    Cmd = ["/app/server"];
    Env = [
      "PORT=8080"
      "SSL_CERT_FILE=${pkgs.cacert}/etc/ssl/certs/ca-bundle.crt"
    ];
    ExposedPorts = {"8080/tcp" = {};};
  };
}
