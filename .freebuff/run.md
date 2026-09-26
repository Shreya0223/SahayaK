# SahayaK — Preview run doc

Static client-side SPA (Vite + React + TS, Zustand with localStorage persistence). No backend, no env files, no secrets.

## Reproduce artifacts

```bash
cd sahayak
npm install
```

That's all — there are no `.env*` files to copy and no generated assets. `node_modules` is normally already present in this workspace.

## Run the server (dev preview)

```powershell
# Windows, detached (stdout and stderr MUST go to different files):
powershell -NoProfile -Command "(Start-Process -FilePath 'npm.cmd' -ArgumentList 'run','dev','--','--port','5173','--strictPort' -WorkingDirectory 'C:\Users\shrey\Downloads\Sahayak files\sahayak' -RedirectStandardOutput 'C:\Users\shrey\Downloads\Sahayak files\.freebuff\preview-38e975b7-b7d8-4d47-bdbb-9995cdec7931.log' -RedirectStandardError 'C:\Users\shrey\Downloads\Sahayak files\.freebuff\preview-38e975b7-b7d8-4d47-bdbb-9995cdec7931.log.err' -WindowStyle Hidden -PassThru).Id"
```

- Default port **5173** (Vite default; free in this workspace). Use `--port 5199 --strictPort` if 5173 is taken.
- Vite serves `localhost` only — correct for the preview.
- Verify: `curl http://localhost:5173/` → HTTP 200, then register preview with URL + pid.
- Kill previous instance first if one is listening: `netstat -ano | findstr :5173` then `taskkill /PID <pid> /F`.
