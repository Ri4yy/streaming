import { NextRequest, NextResponse } from 'next/server';
import { steamApi } from '@/services/steam';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    if (!id) {
        return new NextResponse('Missing id', { status: 400 });
    }

    try {
        const gameDetails = await steamApi.getGameDetails(id);
        
        if (gameDetails && gameDetails.header_image) {
            return NextResponse.redirect(gameDetails.header_image);
        }

        // Fallback to a generic construction if API fails or doesn't have it
        return NextResponse.redirect(`https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${id}/header.jpg`);
    } catch (error) {
        console.error('Error fetching steam image:', error);
        return NextResponse.redirect(`https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${id}/header.jpg`);
    }
}
