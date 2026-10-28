{
  description = "Botato Ads - Svelte + Tailwind site running on Bun";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    { nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs { inherit system; };
      in
      {
        devShells.default = pkgs.mkShell {
          packages = with pkgs; [
            bun
            imagemagick # used to (re)generate the clean placement images in static assets
          ];

          shellHook = ''
            if [ ! -d node_modules ]; then
              echo "Installing JS dependencies with bun..."
              bun install
            fi
            echo "bun $(bun --version) ready - run 'bun run dev'"
          '';
        };
      }
    );
}
