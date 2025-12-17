// src/routes/api/identificar-mod/+server.js
import { json } from '@sveltejs/kit';

const USER_AGENT = 'ModrinthDowloader/1.0 (bryanjsypenofender@gmail.com)';

export async function POST({ request }) {
    try {
        const { hash } = await request.json();
        if (!hash) return json({ error: 'Falta hash' }, { status: 400 });

        // PASO 1: Identificar la versión por Hash
        const versionResp = await fetch('https://api.modrinth.com/v2/version_files', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'User-Agent': USER_AGENT },
            body: JSON.stringify({ hashes: [hash], algorithm: 'sha1' })
        });

        const versionData = await versionResp.json();
        const versionInfo = versionData[hash];

        if (!versionInfo) {
            return json({ found: false });
        }

        // PASO 2: Obtener el nombre del Mod usando el project_id
        // El endpoint es: GET /project/{id}
        const projectId = versionInfo.project_id;

        const projectResp = await fetch(`https://api.modrinth.com/v2/project/${projectId}`, {
            method: 'GET',
            headers: { 'User-Agent': USER_AGENT }
        });

        const projectInfo = await projectResp.json();

        // PASO 3: Devolver al frontend solo lo útil y mezclado
        return json({
            found: true,
            data: {
                // --- AGREGA ESTO AQUÍ ---
                project_id: projectId,             // <--- ¡Faltaba esto!

                // Datos del Proyecto
                mod_name: projectInfo.title,
                mod_slug: projectInfo.slug,
                icon_url: projectInfo.icon_url,
                description: projectInfo.description,

                // Datos del Archivo instalado
                version_id: versionInfo.id,
                file_name: versionInfo.files[0].filename,
                loaders: versionInfo.loaders,
                mc_versions: versionInfo.game_versions
            }
        });

    } catch (error) {
        console.error('Error:', error);
        return json({ error: 'Error interno' }, { status: 500 });
    }
}