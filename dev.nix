{ pkgs ? import (fetchTarball "https://github.com/NixOS/nixpkgs/archive/nixos-23.05.tar.gz") {} }:
pkgs.mkShell {
  # The Nix packages available in your environment
  packages = [
    (pkgs.nodejs.override {
      isLTS = true;
    })
    pkgs.cowsay
  ];

  # The environment variables available in your environment
  # env = {
  #   MY_ENV_VAR = "I'm an environment variable!";
  # };

  # The commands that will be run when you enter your environment
  # shellHook = ''
  #   cowsay "Hello, world!"
  # '';

  # The processes that will be started when you enter your environment
  # Learn more about previews: https://www.jetpack.io/devbox/docs/previews/
  previews = [
    {
      # The command to start your preview
      # For example, for a Python app, this would be `python -m http.server 8080`
      command = "npx http-server -p 8080";

      # The port that your preview will be available on
      port = 8080;
    }
  ];
}
