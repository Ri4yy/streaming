import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    if (!id) {
        return new NextResponse('Missing id', { status: 400 });
    }

    const url = `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${id}/library_600x900_2x.jpg`;

    try {
        const response = await fetch(url, { method: 'HEAD' });
        
        if (!response.ok) {
            return new NextResponse('Not found', { status: 404 });
        }
        
        const contentLength = response.headers.get('content-length');
        
        if (contentLength && parseInt(contentLength, 10) < 5000) {
            return new NextResponse('Placeholder detected', { status: 404 });
        }
        // Если картинка нормальная, скачиваем её и отдаем как буфер, 
        // чтобы next/image мог её корректно оптимизировать (он не любит редиректы)
        const imageRes = await fetch(url);
        const buffer = await imageRes.arrayBuffer();
        
        return new NextResponse(buffer, {
            headers: {
                'Content-Type': imageRes.headers.get('content-type') || 'image/jpeg',
                'Cache-Control': 'public, max-age=86400',
            }
        });
    } catch (error) {
        return new NextResponse('Error', { status: 500 });
    }
}
