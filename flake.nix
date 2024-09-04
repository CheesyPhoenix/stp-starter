{
  inputs = {
    pkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    prisma-utils.url = "github:VanCoding/nix-prisma-utils";
  };

  outputs = { self, pkgs, prisma-utils }:
  let
      system = "x86_64-linux";
      nixpkgs = import pkgs { inherit system; };
      prisma =
        (prisma-utils.lib.prisma-factory {
          inherit nixpkgs;
          prisma-fmt-hash = "sha256-Lj0V8E9a+q6+PvCF2ARRs34n1Ls3vySVmtN1rxfltRg="; # If prisma is updated nix will complain about mismatched hashes. Simply copy the correct hashes from the error to fix the problem
          query-engine-hash = "sha256-1BwohGMohcS0rQkrbD+4ne63NOtlZnxLfYUEMrnbglg=";
          libquery-engine-hash = "sha256-WWE2c5Xjw+7wbeGcdX6UU8YzPeT1vZQxye/Mh8XFsCA=";
          schema-engine-hash = "sha256-y5zt3jlaIBoxNHcDitOkMfLd/5doCadVmUiE4bAM/MA=";
        }).fromPnpmLock
          ./pnpm-lock.yaml;
  in
  {
    devShells.${system}.default =
      nixpkgs.mkShell {
          buildInputs = with nixpkgs; [
            # Deps here
            pnpm
            nodejs
            openssl
          ];
          shellHook = prisma.shellHook;
      };
  };
}
