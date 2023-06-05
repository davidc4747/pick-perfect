import { exec } from "child_process";

/* ======================== *\
    # Utils
\* ======================== */

export async function execAsync(
    command: string,
    options: Parameters<typeof exec>["1"]
): Promise<any> {
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

export function wait(miliseconds: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, miliseconds));
}
