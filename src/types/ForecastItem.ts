export interface ForecastItem {
    dt: number; // Timestamp
    main: { 
        temp_min: number; 
        temp_max: number;
    };
    weather: { 
        icon: string; 
        main: string;
    }[];
}