import { exec } from "child_process";
import * as https from "https";

const RIOT_GAMES_CERT = `
-----BEGIN CERTIFICATE-----
MIIEIDCCAwgCCQDJC+QAdVx4UDANBgkqhkiG9w0BAQUFADCB0TELMAkGA1UEBhMC
VVMxEzARBgNVBAgTCkNhbGlmb3JuaWExFTATBgNVBAcTDFNhbnRhIE1vbmljYTET
MBEGA1UEChMKUmlvdCBHYW1lczEdMBsGA1UECxMUTG9MIEdhbWUgRW5naW5lZXJp
bmcxMzAxBgNVBAMTKkxvTCBHYW1lIEVuZ2luZWVyaW5nIENlcnRpZmljYXRlIEF1
dGhvcml0eTEtMCsGCSqGSIb3DQEJARYeZ2FtZXRlY2hub2xvZ2llc0ByaW90Z2Ft
ZXMuY29tMB4XDTEzMTIwNDAwNDgzOVoXDTQzMTEyNzAwNDgzOVowgdExCzAJBgNV
BAYTAlVTMRMwEQYDVQQIEwpDYWxpZm9ybmlhMRUwEwYDVQQHEwxTYW50YSBNb25p
Y2ExEzARBgNVBAoTClJpb3QgR2FtZXMxHTAbBgNVBAsTFExvTCBHYW1lIEVuZ2lu
ZWVyaW5nMTMwMQYDVQQDEypMb0wgR2FtZSBFbmdpbmVlcmluZyBDZXJ0aWZpY2F0
ZSBBdXRob3JpdHkxLTArBgkqhkiG9w0BCQEWHmdhbWV0ZWNobm9sb2dpZXNAcmlv
dGdhbWVzLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAKoJemF/
6PNG3GRJGbjzImTdOo1OJRDI7noRwJgDqkaJFkwv0X8aPUGbZSUzUO23cQcCgpYj
21ygzKu5dtCN2EcQVVpNtyPuM2V4eEGr1woodzALtufL3Nlyh6g5jKKuDIfeUBHv
JNyQf2h3Uha16lnrXmz9o9wsX/jf+jUAljBJqsMeACOpXfuZy+YKUCxSPOZaYTLC
y+0GQfiT431pJHBQlrXAUwzOmaJPQ7M6mLfsnpHibSkxUfMfHROaYCZ/sbWKl3lr
ZA9DbwaKKfS1Iw0ucAeDudyuqb4JntGU/W0aboKA0c3YB02mxAM4oDnqseuKV/CX
8SQAiaXnYotuNXMCAwEAATANBgkqhkiG9w0BAQUFAAOCAQEAf3KPmddqEqqC8iLs
lcd0euC4F5+USp9YsrZ3WuOzHqVxTtX3hR1scdlDXNvrsebQZUqwGdZGMS16ln3k
WObw7BbhU89tDNCN7Lt/IjT4MGRYRE+TmRc5EeIXxHkQ78bQqbmAI3GsW+7kJsoO
q3DdeE+M+BUJrhWorsAQCgUyZO166SAtKXKLIcxa+ddC49NvMQPJyzm3V+2b1roP
SvD2WV8gRYUnGmy/N0+u6ANq5EsbhZ548zZc+BI4upsWChTLyxt2RxR7+uGlS1+5
EcGfKZ+g024k/J32XP4hdho7WYAS2xMiV83CfLR/MNi8oSMaVQTdKD8cpgiWJk3L
XWehWA==
-----END CERTIFICATE-----
`;

/* ======================== *\
    #
\* ======================== */

interface Credentials {
    host: string;
    protocol: string;
    username: string;
    password: string;
    port: string;
    authorization: string;
    agent: https.Agent;
}

export async function getCredentials(): Promise<Credentials> {
    return new Promise(function retry(resolve, reject) {
        // Keep trying until something Comes back.
        getLeagueProccessData().then(function tick(data) {
            if (data) {
                resolve(data);
            } else {
                setTimeout(retry, 250, resolve, reject);
            }
        });
    });
}

async function getLeagueProccessData(): Promise<Credentials | null> {
    const name = "LeagueClientUx";
    const isWindows = process.platform === "win32";

    // Get the correct command for the Operating System
    // NOTE: Credit for this comes from https://github.com/matsjla/league-connect/blob/master/src/authentication.ts
    let command: string;
    if (isWindows) {
        command = `Get-CimInstance -Query "SELECT * from Win32_Process WHERE name LIKE '${name}.exe'" | Select-Object CommandLine | fl`;
    } else {
        command = `ps x -o args | grep '${name}'`;
    }

    try {
        // Parse data from the command output
        const map = new Map<string, string>();
        const stdout: string = await execAsync(
            command,
            isWindows ? { shell: "powershell" } : {}
        );
        stdout
            .replaceAll(/[\s\r\n]+/g, " ")
            .split('" "--')
            .filter((str, index) => Boolean(str) && index > 0)
            .forEach((str) => {
                const [key, value] = str.split("=");
                map.set(key, value ?? "");
            });

        const password = map.get("remoting-auth-token") ?? "";
        const sslConfiguredAgent = new https.Agent({ ca: RIOT_GAMES_CERT });
        const authentication = Buffer.from(`riot:${password}`);

        return {
            // processName: map.get("app-name") ?? "",
            // processID: map.get("app-pid") ?? "",
            protocol: "https",
            host: "127.0.0.1",
            port: map.get("app-port") ?? "",
            username: "riot",
            password,
            authorization: `Basic ${authentication.toString("base64")}`,
            agent: sslConfiguredAgent,
        };
    } catch (err) {
        return null;
    }
}

/* ======================== *\
    # Utils
\* ======================== */

async function execAsync(command: string, options: any): Promise<any> {
    return new Promise(function (resolve, reject) {
        exec(command, options, function (err, stdout, stderr) {
            if (err) {
                console.error(err, stderr);
                reject(null);
            } else {
                resolve(stdout);
            }
        });
    });
}
