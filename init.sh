#!/bin/sh
if grep -q 'Debian' /etc/os-release && uname -m | grep -q 'aarch64'
then
    sudo apt update
    sudo apt install -y nodejs curl git
    curl -fsSL https://raw.githubusercontent.com/pjgpetecodes/dotnet8pi/main/install.sh | sudo bash
fi

git clone https://github.com/Lucrasoft/Splitter.git
( cd Splitter/Source && dotnet restore && dotnet build --self-contained false )
mv Splitter/Source/Tester/bin/Debug/net8.0 tester

curl -fsSL https://bun.sh/install | bash

( source ~/.bun/bin && bun install )
