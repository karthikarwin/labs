export interface ReceiveIpInfo {
    'ip': String;
    'isp': String;
    'org': String;
    'hostname': String;
    'longitude': string;
    'latitude': string;
    'postal_code': String;
    'city': String;
    'country_code': String;
    'country_name': String;
    'continent_code': String;
    'region': String;
    'district': String;
    'timezone_name': String;
    'connection_type': String;
    'asn': String;
    'currency_code': String;
    'currency_name': String;
    'success': Boolean;
}

export interface SendIpInfo {
    username: String;
    ipaddress: String;
    countrycode: String;
    countryname: String;
    regioncode: String;
    regionname: String;
    city: String;
    zipcode: String;
    timezone: String;
    latitude: Number;
    longitude: Number;
    sessionId: String;
}
