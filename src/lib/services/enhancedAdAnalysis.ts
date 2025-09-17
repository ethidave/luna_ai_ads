import { Campaign } from '../entities/Campaign';

export interface AdAnalysisResult {
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: AdRecommendation[];
  performanceInsights: PerformanceInsight[];
  optimizationSuggestions: OptimizationSuggestion[];
  competitorAnalysis: CompetitorInsight[];
  budgetRecommendations: BudgetRecommendation[];
  creativeSuggestions: CreativeSuggestion[];
  targetingInsights: TargetingInsight[];
}

export interface AdRecommendation {
  category: 'performance' | 'creative' | 'targeting' | 'budget' | 'timing';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  expectedImpact: string;
  implementation: string;
  estimatedImprovement: number; // percentage
}

export interface PerformanceInsight {
  metric: string;
  currentValue: number;
  benchmark: number;
  trend: 'up' | 'down' | 'stable';
  insight: string;
  recommendation: string;
}

export interface OptimizationSuggestion {
  type: 'A/B test' | 'budget reallocation' | 'audience expansion' | 'creative refresh' | 'bidding strategy';
  title: string;
  description: string;
  expectedROI: number;
  difficulty: 'easy' | 'medium' | 'hard';
  timeframe: string;
}

export interface CompetitorInsight {
  competitor: string;
  strength: string;
  opportunity: string;
  recommendation: string;
}

export interface BudgetRecommendation {
  currentAllocation: number;
  recommendedAllocation: number;
  reasoning: string;
  expectedROI: number;
}

export interface CreativeSuggestion {
  type: 'headline' | 'description' | 'image' | 'video' | 'cta';
  current: string;
  suggestion: string;
  reasoning: string;
  expectedImprovement: number;
}

export interface TargetingInsight {
  audience: string;
  performance: number;
  recommendation: string;
  opportunity: string;
}

export class EnhancedAdAnalysisService {
  /**
   * Analyze campaign performance and provide comprehensive insights
   */
  async analyzeCampaign(campaign: Campaign): Promise<AdAnalysisResult> {
    console.log('🔍 Analyzing campaign:', campaign.name);
    
    const performance = this.parsePerformance(campaign.performance);
    const platforms = this.parsePlatforms(campaign.platforms);
    
    return {
      overallScore: this.calculateOverallScore(performance),
      strengths: this.identifyStrengths(performance, platforms),
      weaknesses: this.identifyWeaknesses(performance, platforms),
      recommendations: this.generateRecommendations(performance, platforms, campaign),
      performanceInsights: this.generatePerformanceInsights(performance),
      optimizationSuggestions: this.generateOptimizationSuggestions(performance, platforms, campaign),
      competitorAnalysis: this.generateCompetitorAnalysis(campaign),
      budgetRecommendations: this.generateBudgetRecommendations(performance, campaign.budget),
      creativeSuggestions: this.generateCreativeSuggestions(campaign),
      targetingInsights: this.generateTargetingInsights(campaign)
    };
  }

  /**
   * Generate AI-powered tag suggestions for better targeting
   */
  async generateTargetingTags(
    productName: string,
    industry: string,
    targetAudience: string,
    platform: string,
    objective: string
  ): Promise<{
    facebookTags: string[];
    googleTags: string[];
    generalTags: string[];
    longTailKeywords: string[];
    negativeKeywords: string[];
    audienceInsights: string[];
  }> {
    console.log('🏷️ Generating targeting tags for:', { productName, industry, targetAudience, platform, objective });

    // Facebook-specific tags
    const facebookTags = [
      `${productName.toLowerCase()}`,
      `${industry.toLowerCase()}`,
      `${targetAudience.toLowerCase()}`,
      'facebook ads',
      'social media marketing',
      'engagement marketing',
      'visual content',
      'video marketing',
      'community building',
      'social proof',
      'retargeting',
      'lookalike audiences',
      'custom audiences',
      'pixel tracking',
      'conversion optimization',
      'A/B testing',
      'ad creative testing',
      'campaign optimization',
      'ROI optimization',
      'social commerce'
    ];

    // Google Ads-specific tags
    const googleTags = [
      `${productName.toLowerCase()}`,
      `${industry.toLowerCase()}`,
      `${targetAudience.toLowerCase()}`,
      'google ads',
      'search marketing',
      'ppc advertising',
      'keyword research',
      'search terms',
      'quality score',
      'ad rank',
      'click through rate',
      'cost per click',
      'landing page optimization',
      'conversion rate optimization',
      'search engine marketing',
      'paid search',
      'display network',
      'shopping ads',
      'youtube ads',
      'remarketing',
      'audience targeting',
      'demographic targeting',
      'interest targeting',
      'behavioral targeting',
      'budget optimization',
      'bid strategy',
      'automated bidding'
    ];

    // General tags
    const generalTags = [
      'digital marketing',
      'online advertising',
      'marketing automation',
      'customer acquisition',
      'lead generation',
      'brand awareness',
      'traffic generation',
      'conversion optimization',
      'marketing analytics',
      'performance marketing',
      'growth hacking',
      'marketing strategy',
      'advertising campaign',
      'marketing ROI',
      'customer lifetime value',
      'marketing attribution',
      'cross-channel marketing',
      'omnichannel marketing',
      'marketing technology',
      'marketing data'
    ];

    // Long-tail keywords
    const longTailKeywords = [
      `best ${productName} for ${targetAudience}`,
      `${productName} ${industry} marketing strategy`,
      `how to market ${productName} on ${platform}`,
      `${productName} advertising tips for ${industry}`,
      `effective ${productName} marketing campaigns`,
      `${productName} social media marketing guide`,
      `${productName} google ads optimization`,
      `${productName} facebook ads best practices`,
      `${productName} marketing automation tools`,
      `${productName} customer acquisition strategy`
    ];

    // Negative keywords
    const negativeKeywords = [
      'free',
      'cheap',
      'discount',
      'sale',
      'promo',
      'coupon',
      'voucher',
      'trial',
      'demo',
      'test',
      'sample',
      'freebie',
      'giveaway',
      'contest',
      'competition'
    ];

    // Audience insights
    const audienceInsights = [
      `Target ${targetAudience} interested in ${industry}`,
      `Focus on ${platform} users aged 25-45`,
      `Target users with ${industry} interests`,
      `Lookalike audiences based on existing customers`,
      `Retarget website visitors and app users`,
      `Target users who engaged with similar content`,
      `Focus on mobile-first audience for ${platform}`,
      `Target users in high-value geographic locations`,
      `Create custom audiences from email lists`,
      `Use interest-based targeting for ${industry}`
    ];

    return {
      facebookTags: facebookTags.slice(0, 20),
      googleTags: googleTags.slice(0, 20),
      generalTags: generalTags.slice(0, 15),
      longTailKeywords: longTailKeywords.slice(0, 10),
      negativeKeywords: negativeKeywords.slice(0, 10),
      audienceInsights: audienceInsights.slice(0, 10)
    };
  }

  /**
   * Generate ad copy suggestions for better performance
   */
  async generateAdCopySuggestions(
    currentCopy: string,
    platform: string,
    objective: string,
    targetAudience: string
  ): Promise<{
    headlines: string[];
    descriptions: string[];
    callToActions: string[];
    emotionalAppeals: string[];
    urgencyTriggers: string[];
    socialProof: string[];
  }> {
    console.log('✍️ Generating ad copy suggestions for:', { platform, objective, targetAudience });

    const headlines = [
      `Transform Your ${targetAudience} Experience with Our Solution`,
      `Why ${targetAudience} Choose Us Over Competitors`,
      `The ${targetAudience} Solution You've Been Waiting For`,
      `Join Thousands of Happy ${targetAudience} Customers`,
      `Discover the Secret to ${targetAudience} Success`,
      `The Ultimate ${targetAudience} Guide You Need`,
      `Stop Struggling - Start Succeeding with ${targetAudience}`,
      `The ${targetAudience} Revolution Starts Here`,
      `Unlock Your ${targetAudience} Potential Today`,
      `The ${targetAudience} Breakthrough You Deserve`
    ];

    const descriptions = [
      `Join thousands of ${targetAudience} who have already transformed their experience. Our proven solution delivers real results you can see and feel.`,
      `Don't let another day pass without the ${targetAudience} solution you need. Our customers report 3x better results in just 30 days.`,
      `The ${targetAudience} industry is changing fast. Stay ahead with our innovative approach that's already helped 10,000+ customers.`,
      `Why settle for average when you can have exceptional? Our ${targetAudience} solution delivers premium results at an affordable price.`,
      `The secret to ${targetAudience} success isn't luck - it's the right tools. Discover what our customers already know.`,
      `Stop wasting time and money on solutions that don't work. Our ${targetAudience} approach is backed by real results and real customers.`,
      `The ${targetAudience} landscape is competitive, but you don't have to struggle alone. Join our community of successful users.`,
      `Transform your ${targetAudience} experience from frustrating to fantastic. Our solution makes the difference you've been looking for.`,
      `The ${targetAudience} solution that actually works. No hype, no false promises - just real results you can count on.`,
      `Why do ${targetAudience} professionals choose us? Because we deliver what others only promise. See the difference for yourself.`
    ];

    const callToActions = [
      'Get Started Today',
      'Learn More Now',
      'Try It Free',
      'See Results',
      'Join Now',
      'Discover More',
      'Start Your Journey',
      'Unlock Potential',
      'Transform Today',
      'Experience Success'
    ];

    const emotionalAppeals = [
      'Don\'t let your competition get ahead',
      'You deserve better results',
      'Your success is our priority',
      'Join the winners circle',
      'Stop settling for less',
      'Your breakthrough moment is here',
      'Don\'t miss this opportunity',
      'Your future self will thank you',
      'The time is now',
      'You\'ve earned this success'
    ];

    const urgencyTriggers = [
      'Limited time offer',
      'Only 24 hours left',
      'While supplies last',
      'Exclusive for early adopters',
      'First 100 customers only',
      'Ends this week',
      'Don\'t wait - act now',
      'Last chance to save',
      'Limited spots available',
      'Offer expires soon'
    ];

    const socialProof = [
      'Join 10,000+ satisfied customers',
      'Trusted by industry leaders',
      '5-star rated by users',
      'Featured in top publications',
      'Award-winning solution',
      'Recommended by experts',
      'Used by Fortune 500 companies',
      'Loved by customers worldwide',
      'Proven by real results',
      'Endorsed by professionals'
    ];

    return {
      headlines: headlines.slice(0, 5),
      descriptions: descriptions.slice(0, 5),
      callToActions: callToActions.slice(0, 5),
      emotionalAppeals: emotionalAppeals.slice(0, 5),
      urgencyTriggers: urgencyTriggers.slice(0, 5),
      socialProof: socialProof.slice(0, 5)
    };
  }

  private parsePerformance(performance: any): any {
    if (typeof performance === 'string') {
      try {
        return JSON.parse(performance);
      } catch {
        return {
          impressions: 0,
          clicks: 0,
          conversions: 0,
          spend: 0,
          ctr: 0,
          cpc: 0,
          roas: 0
        };
      }
    }
    return performance || {
      impressions: 0,
      clicks: 0,
      conversions: 0,
      spend: 0,
      ctr: 0,
      cpc: 0,
      roas: 0
    };
  }

  private parsePlatforms(platforms: string): string[] {
    if (typeof platforms === 'string') {
      try {
        return JSON.parse(platforms);
      } catch {
        return ['facebook', 'google'];
      }
    }
    return platforms || ['facebook', 'google'];
  }

  private calculateOverallScore(performance: any): number {
    const ctr = performance.ctr || 0;
    const roas = performance.roas || 0;
    const conversions = performance.conversions || 0;
    
    // Weighted score calculation
    const ctrScore = Math.min(ctr * 10, 100); // CTR * 10, max 100
    const roasScore = Math.min(roas * 20, 100); // ROAS * 20, max 100
    const conversionScore = Math.min(conversions * 2, 100); // Conversions * 2, max 100
    
    return Math.round((ctrScore + roasScore + conversionScore) / 3);
  }

  private identifyStrengths(performance: any, platforms: string[]): string[] {
    const strengths: string[] = [];
    
    if (performance.ctr > 2) strengths.push('High click-through rate');
    if (performance.roas > 3) strengths.push('Strong return on ad spend');
    if (performance.conversions > 10) strengths.push('Good conversion volume');
    if (platforms.includes('facebook')) strengths.push('Facebook integration active');
    if (platforms.includes('google')) strengths.push('Google Ads integration active');
    if (performance.spend < 100) strengths.push('Efficient budget usage');
    
    return strengths.length > 0 ? strengths : ['Campaign is live and running'];
  }

  private identifyWeaknesses(performance: any, platforms: string[]): string[] {
    const weaknesses: string[] = [];
    
    if (performance.ctr < 1) weaknesses.push('Low click-through rate');
    if (performance.roas < 2) weaknesses.push('Poor return on ad spend');
    if (performance.conversions < 5) weaknesses.push('Low conversion volume');
    if (performance.cpc > 5) weaknesses.push('High cost per click');
    if (platforms.length < 2) weaknesses.push('Limited platform reach');
    
    return weaknesses.length > 0 ? weaknesses : ['No major issues detected'];
  }

  private generateRecommendations(performance: any, platforms: string[], campaign: Campaign): AdRecommendation[] {
    const recommendations: AdRecommendation[] = [];
    
    if (performance.ctr < 1) {
      recommendations.push({
        category: 'creative',
        priority: 'high',
        title: 'Improve Ad Creative',
        description: 'Your click-through rate is below industry average. Test new headlines and images.',
        expectedImpact: 'Increase CTR by 50-100%',
        implementation: 'Create 3-5 new ad variations with different headlines and visuals',
        estimatedImprovement: 75
      });
    }
    
    if (performance.roas < 2) {
      recommendations.push({
        category: 'targeting',
        priority: 'high',
        title: 'Refine Audience Targeting',
        description: 'Your ROAS suggests targeting could be more precise.',
        expectedImpact: 'Improve ROAS by 40-60%',
        implementation: 'Use lookalike audiences and exclude low-performing demographics',
        estimatedImprovement: 50
      });
    }
    
    if (platforms.length < 2) {
      recommendations.push({
        category: 'performance',
        priority: 'medium',
        title: 'Expand Platform Reach',
        description: 'Add more advertising platforms to increase reach and diversify risk.',
        expectedImpact: 'Increase total reach by 30-50%',
        implementation: 'Add Instagram and YouTube to your campaign mix',
        estimatedImprovement: 40
      });
    }
    
    return recommendations;
  }

  private generatePerformanceInsights(performance: any): PerformanceInsight[] {
    return [
      {
        metric: 'Click-Through Rate',
        currentValue: performance.ctr || 0,
        benchmark: 2.0,
        trend: performance.ctr > 2 ? 'up' : 'down',
        insight: performance.ctr > 2 ? 'CTR is above industry average' : 'CTR needs improvement',
        recommendation: performance.ctr > 2 ? 'Maintain current creative strategy' : 'Test new ad creatives'
      },
      {
        metric: 'Return on Ad Spend',
        currentValue: performance.roas || 0,
        benchmark: 3.0,
        trend: performance.roas > 3 ? 'up' : 'down',
        insight: performance.roas > 3 ? 'Strong profitability' : 'ROAS needs optimization',
        recommendation: performance.roas > 3 ? 'Scale successful campaigns' : 'Optimize targeting and creative'
      },
      {
        metric: 'Cost Per Click',
        currentValue: performance.cpc || 0,
        benchmark: 2.5,
        trend: performance.cpc < 2.5 ? 'up' : 'down',
        insight: performance.cpc < 2.5 ? 'Efficient cost per click' : 'CPC is too high',
        recommendation: performance.cpc < 2.5 ? 'Maintain current bidding' : 'Improve ad relevance and quality score'
      }
    ];
  }

  private generateOptimizationSuggestions(performance: any, platforms: string[], campaign: Campaign): OptimizationSuggestion[] {
    return [
      {
        type: 'A/B test',
        title: 'Test New Ad Creatives',
        description: 'Create 3-5 variations with different headlines, images, and descriptions',
        expectedROI: 25,
        difficulty: 'easy',
        timeframe: '1-2 weeks'
      },
      {
        type: 'audience expansion',
        title: 'Expand Lookalike Audiences',
        description: 'Create 1% and 5% lookalike audiences based on your best customers',
        expectedROI: 40,
        difficulty: 'medium',
        timeframe: '2-3 weeks'
      },
      {
        type: 'budget reallocation',
        title: 'Reallocate Budget to Top Performers',
        description: 'Move budget from underperforming campaigns to high-ROI campaigns',
        expectedROI: 30,
        difficulty: 'easy',
        timeframe: '1 week'
      }
    ];
  }

  private generateCompetitorAnalysis(campaign: Campaign): CompetitorInsight[] {
    return [
      {
        competitor: 'Industry Average',
        strength: 'Higher ad spend',
        opportunity: 'Better creative quality',
        recommendation: 'Focus on unique value proposition and emotional appeal'
      },
      {
        competitor: 'Top Performer',
        strength: 'Advanced targeting',
        opportunity: 'More engaging content',
        recommendation: 'Implement similar targeting strategies and improve content quality'
      }
    ];
  }

  private generateBudgetRecommendations(performance: any, budget: number): BudgetRecommendation[] {
    return [
      {
        currentAllocation: budget,
        recommendedAllocation: budget * 1.2,
        reasoning: 'Increase budget by 20% to scale successful campaigns',
        expectedROI: 35
      }
    ];
  }

  private generateCreativeSuggestions(campaign: Campaign): CreativeSuggestion[] {
    return [
      {
        type: 'headline',
        current: campaign.name,
        suggestion: `${campaign.name} - The Solution You Need`,
        reasoning: 'More compelling and benefit-focused',
        expectedImprovement: 25
      },
      {
        type: 'cta',
        current: 'Learn More',
        suggestion: 'Get Started Today',
        reasoning: 'More action-oriented and urgent',
        expectedImprovement: 20
      }
    ];
  }

  private generateTargetingInsights(campaign: Campaign): TargetingInsight[] {
    return [
      {
        audience: 'Primary Audience',
        performance: 85,
        recommendation: 'Scale this audience with increased budget',
        opportunity: 'Test similar audiences for expansion'
      },
      {
        audience: 'Secondary Audience',
        performance: 60,
        recommendation: 'Optimize targeting parameters',
        opportunity: 'Refine demographics and interests'
      }
    ];
  }
}

export const enhancedAdAnalysisService = new EnhancedAdAnalysisService();
