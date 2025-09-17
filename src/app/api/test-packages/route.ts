import { NextRequest, NextResponse } from "next/server";
import { AppDataSource } from "@/lib/database";
import { Package } from "@/lib/entities/Package";

export async function GET(request: NextRequest) {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const packageRepository = AppDataSource.getRepository(Package);
    
    // Get all packages
    const packages = await packageRepository.find();
    
    console.log("Total packages in database:", packages.length);
    console.log("Packages:", packages.map(pkg => ({
      id: pkg.id,
      name: pkg.name,
      price: pkg.price,
      type: pkg.type,
      status: pkg.status
    })));

    return NextResponse.json({ 
      success: true,
      totalPackages: packages.length,
      packages: packages.map(pkg => ({
        id: pkg.id,
        name: pkg.name,
        price: pkg.price,
        type: pkg.type,
        status: pkg.status,
        features: pkg.features,
        platforms: pkg.platforms
      }))
    });
  } catch (error) {
    console.error("Error fetching packages:", error);
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}


