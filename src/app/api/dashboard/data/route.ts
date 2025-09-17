import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { AppDataSource } from '@/lib/database';
import { User } from '@/lib/entities/User';
import { AdCampaign } from '@/lib/entities/AdCampaign';
import { Campaign } from '@/lib/entities/Campaign';
import { Payment } from '@/lib/entities/Payment';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Initialize database connection
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const userRepository = AppDataSource.getRepository(User);
    const campaignRepository = AppDataSource.getRepository(Campaign);
    const adCampaignRepository = AppDataSource.getRepository(AdCampaign);
    const paymentRepository = AppDataSource.getRepository(Payment);

    const user = await userRepository.findOne({
      where: { id: session.user.id },
      relations: ['campaigns', 'subscriptions', 'payments']
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get user's campaigns
    const campaigns = await campaignRepository.find({
      where: { user: { id: user.id } },
      relations: ['analytics', 'payments']
    });

    const adCampaigns = await adCampaignRepository.find({
      where: { user: { id: user.id } }
    });

    // Calculate stats from real data
    const totalCampaigns = campaigns.length + adCampaigns.length;
    const activeCampaigns = campaigns.filter(c => c.status === 'active').length + 
                           adCampaigns.filter(c => c.status === 'active').length;

    // Calculate total spent from payments
    const payments = await paymentRepository.find({
      where: { user: { id: user.id } }
    });

    const totalSpent = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
    
    // Calculate other metrics from campaigns
    const totalImpressions = campaigns.reduce((sum, campaign) => sum + (campaign.analytics?.reduce((aSum, analytics) => aSum + (analytics.impressions || 0), 0) || 0), 0);
    const totalClicks = campaigns.reduce((sum, campaign) => sum + (campaign.analytics?.reduce((aSum, analytics) => aSum + (analytics.clicks || 0), 0) || 0), 0);
    const totalConversions = campaigns.reduce((sum, campaign) => sum + (campaign.analytics?.reduce((aSum, analytics) => aSum + (analytics.conversions || 0), 0) || 0), 0);

    // Calculate derived metrics
    const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
    const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;
    const costPerClick = totalClicks > 0 ? totalSpent / totalClicks : 0;
    const costPerConversion = totalConversions > 0 ? totalSpent / totalConversions : 0;
    const revenue = totalConversions * 50; // Assuming $50 per conversion
    const avgROAS = totalSpent > 0 ? revenue / totalSpent : 0;

    const stats = {
      totalCampaigns,
      activeCampaigns,
      totalSpent: Math.round(totalSpent * 100) / 100,
      totalImpressions,
      totalClicks,
      totalConversions,
      avgCTR: Math.round(avgCTR * 100) / 100,
      avgROAS: Math.round(avgROAS * 100) / 100,
      conversionRate: Math.round(conversionRate * 100) / 100,
      costPerClick: Math.round(costPerClick * 100) / 100,
      costPerConversion: Math.round(costPerConversion * 100) / 100,
      revenue: Math.round(revenue * 100) / 100,
    };

    // Generate chart data for the last 30 days
    const chartData = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Generate realistic data based on user's actual performance
      const baseImpressions = totalImpressions / 30;
      const baseClicks = totalClicks / 30;
      const baseConversions = totalConversions / 30;
      const baseSpend = totalSpent / 30;
      const baseRevenue = revenue / 30;

      chartData.push({
        date: date.toISOString().split('T')[0],
        impressions: Math.floor(baseImpressions * (0.5 + Math.random())),
        clicks: Math.floor(baseClicks * (0.5 + Math.random())),
        conversions: Math.floor(baseConversions * (0.5 + Math.random())),
        spend: Math.round(baseSpend * (0.5 + Math.random()) * 100) / 100,
        revenue: Math.round(baseRevenue * (0.5 + Math.random()) * 100) / 100,
      });
    }

    // Device data (mock for now)
    const deviceData = [
      { name: "Desktop", value: 45, color: "#3B82F6" },
      { name: "Mobile", value: 40, color: "#10B981" },
      { name: "Tablet", value: 15, color: "#F59E0B" },
    ];

    // Traffic data (mock for now)
    const trafficData = [
      { name: "Organic", value: 35, color: "#8B5CF6" },
      { name: "Paid", value: 30, color: "#EF4444" },
      { name: "Direct", value: 20, color: "#06B6D4" },
      { name: "Social", value: 15, color: "#F97316" },
    ];

    // Conversion data (mock for now)
    const conversionData = [
      { name: "Email Signup", value: 40, color: "#3B82F6" },
      { name: "Purchase", value: 35, color: "#10B981" },
      { name: "Download", value: 15, color: "#F59E0B" },
      { name: "Contact", value: 10, color: "#EF4444" },
    ];

    // Recent campaigns
    const recentCampaigns = campaigns.slice(0, 5).map(campaign => ({
      id: campaign.id,
      name: campaign.name || `Campaign ${campaign.id}`,
      status: campaign.status || 'active',
      budget: campaign.budget || 0,
      spent: campaign.analytics?.reduce((sum, analytics) => sum + (analytics.spend || 0), 0) || 0,
      impressions: campaign.analytics?.reduce((sum, analytics) => sum + (analytics.impressions || 0), 0) || 0,
      clicks: campaign.analytics?.reduce((sum, analytics) => sum + (analytics.clicks || 0), 0) || 0,
      conversions: campaign.analytics?.reduce((sum, analytics) => sum + (analytics.conversions || 0), 0) || 0,
      ctr: campaign.analytics?.reduce((sum, analytics) => sum + (analytics.impressions || 0), 0) > 0 
        ? Math.round((campaign.analytics?.reduce((sum, analytics) => sum + (analytics.clicks || 0), 0) / campaign.analytics?.reduce((sum, analytics) => sum + (analytics.impressions || 0), 0)) * 10000) / 100
        : 0,
      roas: campaign.analytics?.reduce((sum, analytics) => sum + (analytics.spend || 0), 0) > 0
        ? Math.round((campaign.analytics?.reduce((sum, analytics) => sum + (analytics.conversions || 0), 0) * 50 / campaign.analytics?.reduce((sum, analytics) => sum + (analytics.spend || 0), 0)) * 100) / 100
        : 0,
    }));

    return NextResponse.json({
      stats,
      chartData,
      deviceData,
      trafficData,
      conversionData,
      recentCampaigns,
    });

  } catch (error) {
    console.error('Dashboard data error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

