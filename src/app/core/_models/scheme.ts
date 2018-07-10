
const transferInvestDetails =  {
    'effectiveFrom': Number,
    'loadType': String,
    'frequency': String,
    'minInstallments': Number,
    'minInvamount': Number,
    'invdates': String,
    'loadRate': Number
};

export interface Scheme {
        'code': String;
        'name': String;
        'isActive': String;
        'firstNavDate': Number;
        'minRedemptionAmt'?: any;
        'minRedemptionUnit'?: any;
        'minBalanceAmt'?: any;
        'minBalanceUnit'?: any;
        'minInvestment'?: any;
        'planName'?: String;
        'invOption'?: String;
        'invType'?: String;
        'expenseRatio'?: any;
        'expenseRatioDate'?: any;
        'avgAum'?: any;
        'registrarId'?: 9;
        'avgAumQuarterly'?: any;
        'ytm'?: any;
        'maxInvestamt'?: 0;
        'addtnlMinInvestAmt'?: 0;
        'addtnlMulInvesAamt'?: 0;
        'dividendReinvest'?: false;
        'switchinAvail'?: any;
        'switchoutAvail'?: false;
        'minLockinPeriod'?: '1172 Days';
        'month_3'?: 1;
        'month_6'?: 1;
        'year_1'?: any;
        'year_3'?: any;
        'year_5'?: any;
        'inception'?: 5;
        's_1year'?: any;
        's_3year'?: any;
        's_5year'?: any;
        's_sinceinception'?: any;
        'navDate'?: Number;
        'nav'?: Number;
        'adjustedNav'?: Number;
        'loadDetails'?: [
            {
                'effectiveFrom'?: Number,
                'loadType'?: String,
                'fromDays'?: Number,
                'toDays'?: Number,
                'loadRate'?: any
            },
            {
                'effectiveFrom'?: Number,
                'loadType'?: String,
                'fromDays'?: 0,
                'toDays'?: 0,
                'loadRate'?: any
            }
        ];
        'transferInvestDetails'?: Array<any>;
        'rpDetails'?: [
            {
                'riskProfileName'?: String,
                'instrumentDescription'?: String
            },
            {
                'riskProfileName'?: String,
                'instrumentDescription'?: String
            }
        ];
}

