export const navBackgroundImage = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 2 1'%3E%3Crect fill='%2377aa77' width='2' height='1'/%3E%3Cdefs%3E%3ClinearGradient id='a' gradientUnits='userSpaceOnUse' x1='0' x2='0' y1='0' y2='1'%3E%3Cstop offset='0' stop-color='%2377aa77'/%3E%3Cstop offset='1' stop-color='%234fd'/%3E%3C/linearGradient%3E%3ClinearGradient id='b' gradientUnits='userSpaceOnUse' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%23cf8' stop-opacity='0'/%3E%3Cstop offset='1' stop-color='%23cf8' stop-opacity='1'/%3E%3C/linearGradient%3E%3ClinearGradient id='c' gradientUnits='userSpaceOnUse' x1='0' y1='0' x2='2' y2='2'%3E%3Cstop offset='0' stop-color='%23cf8' stop-opacity='0'/%3E%3Cstop offset='1' stop-color='%23cf8' stop-opacity='1'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect x='0' y='0' fill='url(%23a)' width='2' height='1'%3E%3Canimate attributeName='x' values='0; -2; 0' dur='6s' repeatCount='indefinite' /%3E%3C/rect%3E%3Cg fill-opacity='0.5'%3E%3Cpolygon fill='url(%23b)' points='0 1 0 0 2 0'%3E%3Canimate attributeName='points' values='0 1 0 0 2 0; 0 1 0 0 2 1; 0 1 0 0 2 0' dur='6s' repeatCount='indefinite' /%3E%3C/polygon%3E%3Cpolygon fill='url(%23c)' points='2 1 2 0 0 0'%3E%3Canimate attributeName='points' values='2 1 2 0 0 0; 2 1 2 0 2 0; 2 1 2 0 0 0' dur='6s' repeatCount='indefinite' /%3E%3C/polygon%3E%3C/g%3E%3C/svg%3E")`

export const svgBackground = `
<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="560" viewBox="0 0 1440 560">
<style>
        @keyframes float1 { 
            0%, 100% { transform: translate(0, 0); }
            25% { transform: translate(50px, -30px); }
            50% { transform: translate(-70px, 40px); }
            75% { transform: translate(30px, -20px); }
        }
        @keyframes float2 { 
            0%, 100% { transform: translate(0, 0); }
            25% { transform: translate(-40px, 20px); }
            50% { transform: translate(60px, -50px); }
            75% { transform: translate(-30px, 40px); }
        }
        @keyframes float3 { 
            0%, 100% { transform: translate(0, 0); }
            25% { transform: translate(70px, -10px); }
            50% { transform: translate(-50px, 30px); }
            75% { transform: translate(40px, -40px); }
        }
        .float1 { animation: float1 10s infinite alternate ease-in-out; }
        .float2 { animation: float2 12s infinite alternate ease-in-out; }
        .float3 { animation: float3 8s infinite alternate ease-in-out; }
</style>
<rect width="1440" height="560" fill="#32325d"/>
<defs>
<linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
<stop offset="0%" stop-color="#ab3c51"/>
<stop offset="100%" stop-color="#4f4484"/>
</linearGradient>
<linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
<stop offset="0%" stop-color="#e298de"/>
<stop offset="100%" stop-color="#484687"/>
</linearGradient>
<linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
<stop offset="0%" stop-color="#84b6e0"/>
<stop offset="100%" stop-color="#464a8f"/>
</linearGradient>
</defs>
<circle class="float1" cx="1040" cy="227" r="40" fill="url(#grad1)"/>
<circle class="float2" cx="871" cy="442" r="45" fill="url(#grad2)"/>
<circle class="float3" cx="1082" cy="310" r="43" fill="url(#grad3)"/>
<circle class="float1" cx="1371" cy="112" r="40" fill="url(#grad1)"/>
<circle class="float2" cx="1027" cy="9" r="33" fill="url(#grad2)"/>
<circle class="float3" cx="646" cy="370" r="47" fill="url(#grad3)"/>
<circle class="float1" cx="777" cy="494" r="31" fill="url(#grad1)"/>
<circle class="float2" cx="755" cy="191" r="40" fill="url(#grad2)"/>
<circle class="float3" cx="273" cy="113" r="32" fill="url(#grad3)"/>
<circle class="float1" cx="330" cy="539" r="26" fill="url(#grad1)"/>
</svg>
`;