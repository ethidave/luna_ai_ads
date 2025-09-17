import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { facebookGoogleIntegrationService } from '@/lib/services/facebookGoogleIntegration';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🔄 Fetching Facebook and Google Ads data...');

    // Get combined data from both platforms
    const data = await facebookGoogleIntegrationService.getCombinedData();

    return NextResponse.json({
      success: true,
      data,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Facebook/Google data fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch platform data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action } = await request.json();

    if (action === 'sync') {
      console.log('💾 Syncing campaigns to database...');
      
      // Sync campaigns to database
      await facebookGoogleIntegrationService.syncCampaignsToDatabase(session.user.id);

      return NextResponse.json({
        success: true,
        message: 'Campaigns synced successfully'
      });
    }

    if (action === 'check_connections') {
      const facebookConnected = facebookGoogleIntegrationService.isFacebookConnected();
      const googleConnected = facebookGoogleIntegrationService.isGoogleConnected();

      return NextResponse.json({
        success: true,
        connections: {
          facebook: facebookConnected,
          google: googleConnected
        }
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Facebook/Google action error:', error);
    return NextResponse.json(
      { error: 'Failed to perform action' },
      { status: 500 }
    );
  }
}
