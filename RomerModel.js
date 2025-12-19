
ModelParams = {
    alpha: 0.25,
    beta: 0.3,
    humanCapital: 100,
    delta: 0.02,
    rho: 1.1,
    sigma: 1,
    eta: 0.2,
    initA: 1,
    labourSupply: 100,
}

// var model = new RomerModel(ModelParams);
// var steady = model.SteadyState();
// var bgps = model.BGP(100);

/* Implementation of Romer Model as specified in Romer (1990),
*  extended to included Balanced Growth Paths.
*/


function RomerModel(params) {
    var a = params.alpha;
    var b = params.beta;
    var d = params.delta;
    var H = params.humanCapital;
    var L = params.labourSupply;
    var rho = params.rho;
    var s = params.sigma;
    var initA = params.initA;
    var eta = params.eta;

    var Lambda = a/((a+b)*(1-a-b));

    /* Rate of growth */
    var g = (d*H - Lambda*rho)/(1+Lambda*s); 
    if (g<0) g=0;
    
    /* Solving */
    var r = g*s-rho;
    var Hy = (1/d)*Lambda*r;
    if (Hy<0) Hy=0
    else if (Hy>H) Hy=H;
    var Ha = H - Hy;
    var p = (r*eta)/(1-a-b);
    var x = Math.pow(p/((1-a-b)*Math.pow(Hy,a)*Math.pow(L,b)),1/(-a-b));
    var Pa = ((a+b)/r)*p*x;
    var monopolyProfits = (a+b)*p*x;

    
    SteadyStates = {
        g: g,                               
        r: r,                               
        Hy: Hy,                             
        Ha: Ha,
        p: p,
        x: x,
        Pa: Pa,
        monopolyProfits: monopolyProfits,
    }

    this.SteadyState = function () {
        return SteadyStates;
    }

    this.BGP = function(N) {
        var Out = {
            A: [],
            K: [],
            C: [],
            Y: [],
            ResearchWages: [],
            LabourerWages: []
        };

        for (let i = 0; i < N; i++) { // Balanced growth paths
            Out.A[i] = initA*Math.pow(1+Ha*d,i);
            Out.K[i] = eta*x*Out.A[i];
            Out.ResearchWages[i] = Pa*d*Out.A[i];
            Out.Y[i] = Math.pow(Hy,a)*Math.pow(L,b)*Out.A[i]*Math.pow(x,(1-a-b));
            Out.C[i] = Out.Y[i]-(Out.K[i]-Out.K[i-1])
            Out.LabourerWages[i] = a*(Out.Y[i]/Hy);
        }

        return Out;
    }
}

/* Social Planner version of the Romer Model */
function RomerModelSP(params) {
    var a = params.alpha;
    var b = params.beta;
    var d = params.delta;
    var H = params.humanCapital;
    var L = params.labourSupply;
    var rho = params.rho;
    var s = params.sigma;
    var initA = params.initA;
    var eta = params.eta;

    var Theta = a/(a+b);

    /* Rate of growth */
    var g = (d*H - Theta*rho)/((1-Theta)+Theta*s); 
    if (g<0) g=0;
    
    /* Solving */
    var r = g*s-rho;
    var Hy = (1/d)*Lambda*r;
    if (Hy<0) Hy=0
    else if (Hy>H) Hy=H;
    var Ha = H - Hy;
    var p = (r*eta)/(1-a-b);
    var x = Math.pow(p/((1-a-b)*Math.pow(Hy,a)*Math.pow(L,b)),1/(-a-b));
    var Pa = ((a+b)/r)*p*x;
    var monopolyProfits = (a+b)*p*x;

    
    SteadyStates = {
        g: g,                               
        r: r,                               
        Hy: Hy,                             
        Ha: Ha,
        p: p,
        x: x,
        Pa: Pa,
        monopolyProfits: monopolyProfits,
    }

    this.SteadyState = function () {
        return SteadyStates;
    }

    this.BGP = function(N) {
        var Out = {
            A: [],
            K: [],
            C: [],
            Y: [],
            ResearchWages: [],
            LabourerWages: []
        };

        for (let i = 0; i < N; i++) { // Balanced growth paths
            Out.A[i] = initA*Math.pow(1+Ha*d,i);
            Out.K[i] = eta*x*Out.A[i];
            Out.ResearchWages[i] = Pa*d*Out.A[i];
            Out.Y[i] = Math.pow(Hy,a)*Math.pow(L,b)*Out.A[i]*Math.pow(x,(1-a-b));
            Out.C[i] = Out.Y[i]-(Out.K[i]-Out.K[i-1])
            Out.LabourerWages[i] = a*(Out.Y[i]/Hy);
        }

        return Out;
    }
}

/* Version of Model where g is unsolved */
function PartialRomer(params) {
    var r = params.interest;
    var a = params.alpha;
    var b = params.beta;
    var d = params.delta;
    var H = params.humanCapital;
    var L = params.labourSupply;
    var rho = params.rho;
    var s = params.sigma;
    var initA = params.initA;
    var eta = params.eta;

    var Lambda = a/((a+b)*(1-a-b));

    var Hy = (1/d)*Lambda*r;
    if (Hy<0) Hy=0
    else if (Hy>H) Hy=H;
    var Ha = H - Hy;
    var p = (r*eta)/(1-a-b);
    var x = Math.pow(p/((1-a-b)*Math.pow(Hy,a)*Math.pow(L,b)),1/(-a-b));
    var Pa = ((a+b)/r)*p*x;
    var monopolyProfits = (a+b)*p*x;

    SteadyStates = {
        r: r,                               
        Hy: Hy,                             
        Ha: Ha,
        p: p,
        x: x,
        Pa: Pa,
        monopolyProfits: monopolyProfits,
    }

    return SteadyStates;
}
