function GraphIt(dataObj,cacheImgs,c) {
    /* Constants for where a point goes off the graph */
    const MAXIMATO = [Infinity,undefined]; 
    const MINIMATO = [-Infinity,undefined];
    
    /*
        dataObj = {
            names: [],
            xName: "",
            lineColours: [],
            equations: [],
            equationPositions: {
                A: [0.04,0.94],			(Relative positions)
                K: [0.04,0.84]
            },
            labels: [],
            labelPositions: [],			(Absolute positions)
            xLines: [],
            yLines: [],
            A: A,
            K: K,
            X: [...Array(N).keys()]
        };
    */
    this.dataObj = dataObj;
    this.cache = {
        equations: [],
        labels: [],
    }
    N = (dataObj.X).length;

    if (cacheImgs != undefined) this.cache = cacheImgs;

    /* Graphing Portion */
    //const c = document.getElementById("Graph");


    if (c.getContext) { // Create our chart
        ctx = c.getContext("2d");
        ctx.clearRect(0,0,c.width,c.height);

        XMax = c.width;
        YMax = c.height;

        // Default padding values
        leftPadPct = argdef(0.02,dataObj.leftPadPct);
        rightPadPct = argdef(0.04,dataObj.rightPadPct);
        topPadPct = argdef(0.02,dataObj.topPadPct);
        bottomPadPct = argdef(0.02,dataObj.bottomPadPct);

        titleRoomPct = argdef(0.05,dataObj.titleRoomPct);
        xAxisPct = argdef(0.17,dataObj.xAxisPct);
        yAxisPct = argdef(0.15,dataObj.yAxisPct);
        /////////////////////////

        leftPad = XMax * (XMax / YMax) * leftPadPct;
        rightPad = XMax * (XMax / YMax) * rightPadPct;
        topPad = YMax * (XMax / YMax) * topPadPct;
        bottomPad = YMax * (XMax / YMax) * bottomPadPct;

        titleRoom = YMax * titleRoomPct;
        xAxisRoom = XMax * xAxisPct;
        yAxisRoom = YMax * yAxisPct;

        tickSize = 20;
        secondTickSize = 10;
        tickFontFactor = 0.8; // Size of tick font relative to axis font

        

        xChartStart = leftPad + xAxisRoom;
        xChartEnd = XMax - rightPad;
        yChartStart = topPad + titleRoom;
        yChartEnd = YMax - bottomPad - yAxisRoom;

        xAxisLength = xChartEnd - xChartStart;
        yAxisLength = yChartEnd - yChartStart;

        axisLineThickness = 8;
        tickWidth = 10;

        title = dataObj.title;
        xLabel = dataObj.xLabel;
        yLabel = dataObj.yLabel;
        yIntercept = "A₀";

        titleFont = "Arial Bold";
        titleFontSize = 60;
        axesFont = "Arial";
        axesFontSize = 60;
        
        positionText();
        // Position text that is outside of the chart
        function positionText() {

            ctx.font = titleFontSize + "px " + titleFont;

            titleWidth = ctx.measureText(title).width;

            titlePosition = {
                x: xChartStart + xAxisLength / 2 - titleWidth / 2,
                y: topPad + titleRoom / 2 + titleFontSize / 2
            }

            ctx.font = axesFontSize + "px " + axesFont;
            xLabelWidth = ctx.measureText(xLabel).width;

            xLabelPosition = {
                x: xChartStart + (xChartEnd - xChartStart) / 2 - (xLabelWidth * 2),
                y: YMax - bottomPad 
            }

            yLabelWidth = ctx.measureText(yLabel).width;

            yLabelPosition = {
                x: leftPad,
                y: topPad + yChartEnd / 2
            }
        }

        /// Graph framing
        
        scaleX = [0, N];
        scaleY = [0, Math.max(...A)];

        if (typeof(dataObj.customFrame) == "object")  {
            scaleX = dataObj.customFrame.X;
            scaleY = dataObj.customFrame.Y;
        } else if (typeof(dataObj.dataFraming)=="boolean") {
            if (dataObj.dataFraming==true) {
                
            }
        }

        xDist = scaleX[1]-scaleX[0];
        if (xDist<0) xDist = -xDist;
        yDist = scaleY[1]-scaleY[0];
        if (yDist<0) yDist = -yDist;
        //scaleY = [Math.min(...A), Math.max(...A)];

        // How many units per pixel
        incrementsX = xAxisLength / (scaleX[1] - scaleX[0]);
        incrementsY = yAxisLength / (scaleY[1] - scaleY[0]);

        // Padding for inside of chart
        leftInnerPad = xAxisLength*0.04;
        rightInnerPad = xAxisLength*0.04;
        topInnerPad = yAxisLength*0.04;
        bottomInnerPad = yAxisLength*0.04;

		console.log("HI")

        function xpos(x) { // Maps points onto chart on canvas
            if (scaleX[1]>=x && x>=scaleX[0]) {
                let newX = xChartStart + incrementsX*(x-scaleX[0]);
                return newX;
            } else if (scaleX[1]<x) {
                return MAXIMATO;
            } else if (scale[0]>x) {
                return MINIMATO;
            }
        }
        function ypos(y) {
            if (scaleY[1]>=y && y>=scaleY[0]) {
                let newY = yChartEnd - incrementsY*(y-scaleY[0]);
                return newY;
            } else if (scaleY[1]<y) {
                return MAXIMATO;
            } else if (scaleY[0]>y) {
                return MINIMATO;
            }
        }

        this.Rerender = function(data) { // Rerender graph with cached images
            GraphIt(data,this.cache,c)
        }

        

        function drawPoints() {
            for (i=0; i<dataObj.points.length; i++) {
                currPoint = dataObj.points[i];
                Point(currPoint);
            }
        }

        function drawXLines() {
            for (i=0; i<dataObj.xLines.length; i++) {
                currLine = dataObj.xLines[i];
                xLine(currLine[0],currLine[1])
            }
        }

        function drawYLines() { 
            for (i=0; i<dataObj.yLines.length; i++) {
                currLine = dataObj.yLines[i];
                yLine(currLine[0],currLine[1])
            }
        }

        function Point(pos) { // Draw a point at pos = [x,y]
            const x = xpos(pos[0]);
            const y = ypos(pos[1]);

            ctx.fillStyle = "black";
            ctx.beginPath();
            ctx.arc(x,y,16,0,2*Math.PI);
            ctx.fill();
        }

        function xLine(xStart,y) { // Draw a straight line to y at xStart
            var Y = ypos(y);
            var X = xpos(xStart);
            if (Y==MAXIMATO) Y = ypos(scaleY[1]); // Still draw the line if the Y-value if offgrid
            if (X==MAXIMATO) return undefined;

            ctx.strokeStyle = "black";
            ctx.setLineDash([20,10]);
            ctx.lineWidth = 8;

            ctx.beginPath();
            ctx.moveTo(X,ypos(scaleY[0]));
            ctx.lineTo(X,Y);
            ctx.stroke();

            ctx.setLineDash([]); // Reset line to solid
        }

        function yLine(x,yStart) { // Draw a straight line to x at yStart
            var Y = ypos(yStart);
            var X = xpos(x);
            if (Y==MAXIMATO) return undefined; // If Y is offgrid - there is no yline
            if (X==MAXIMATO) X = xpos(scaleX[1]); // If X is offgrid - let it me the maximum

            ctx.strokeStyle = "black";
            ctx.setLineDash([20,10]);
            ctx.lineWidth = 8;

            ctx.beginPath();
            ctx.moveTo(xpos(scaleX[0]),Y);
            ctx.lineTo(X,Y);
            ctx.stroke();

            ctx.setLineDash([]); // Reset line to solid
        }

        function RenderLabels(useCachedLabels,lbls) { 
            /* ARGS
                useCachedLabels: bool
                lbls: img object 
            */
            cachedLabels = [];

            if (useCachedLabels) { // If Rerender() is invoked, used cached label images
                for (i=0; i<dataObj.labels.length; i++) {
                    pos = dataObj.labelPositions[i];
                    jstfy = dataObj.labelManualJustify[i]; // Change position on whole canvas with px
                    const x = xpos(pos[0])+jstfy[0];
                    const y = ypos(pos[1])-jstfy[1];

                    renderEqnImageToCanvas(lbls[i],[x,y]);
                }
                return cachedLabels;
            }
            else {
                for (i=0; i<dataObj.labels.length; i++) {
                    pos = dataObj.labelPositions[i];
                    jstfy = dataObj.labelManualJustify[i];
                    const x = xpos(pos[0])+jstfy[0];
                    const y = ypos(pos[1])-jstfy[1];

                    cachedLabels[i] = RenderEquns(dataObj.labels[i],[x,y]);
                }
            }

            return cachedLabels;
        }

        function RenderEquationLegend(useCachedEquations,eqns) { // Render the legend as equations
            //eqnHeightGuess = 80;
            cachedImages = [];

            if (useCachedEquations) { // When the canvas is rerendered
                for (i=0; i<dataObj.names.length; i++) {
                    name = dataObj.names[i];
                    pos = dataObj.equationPositions[name];
                    renderEqnImageToCanvas(eqns[i],[xpos(scaleX[1]*pos[0]),ypos(scaleY[1]*pos[1])]);
                }
                return cachedImages;
            }
            else { // When canvas is rendered the first time
                for (i=0; i<dataObj.names.length; i++) {
                    name = dataObj.names[i];
                    pos = dataObj.equationPositions[name];
                    cachedImages[i] = RenderEquns(dataObj.equations[i],[xpos(scaleX[1]*pos[0]),ypos(scaleY[1]*pos[1])]);
                    
                }
            }
            return cachedImages;
        }

        function RenderLegendBackground() {  // Renders a white square behind the legend
            const pos = dataObj.legendPosition;
            const startPos = pos[0];
            const endPos = pos[1];
            const x0 = xpos(scaleX[1]*startPos[0]);
            const y0 = ypos(scaleY[1]*startPos[1]);
            const x1 = xpos(scaleX[1]*endPos[0]);
            const y1 = ypos(scaleY[1]*endPos[1]);

            ctx.fillStyle = "white";
            ctx.beginPath();
            ctx.rect(x0,y0,x1,y1);
            ctx.fill();
        }

        function RenderEquns(latex,cpos) {// Renders equations on canvas
            
            KRender = document.createElement("span"); // Create DOM element for KaTeX
            katex.render(latex,KRender);
            KString = KRender.getElementsByClassName("katex-mathml")[0].innerHTML; // Use HTML rendering of KATEX

            imageCache = renderHtmlToCanvas(c, cpos, KString);  // Render that damn thing
            return imageCache;
        }

        function renderHtmlToCanvas( canvas, pos, html ) {  // Implementation of HTML to canvas from StackOverflow
            const xPos = pos[0];
            const yPos = pos[1];


            const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width*2}" height="${canvas.height*2}">
        <foreignObject width="100%" height="100%">
            <div xmlns="http://www.w3.org/1999/xhtml">${html}</div>
        </foreignObject>
        </svg>`;
            const scaleWidth = canvas.width*8;
            const scaleHeight = canvas.height*8;

            const svgBlob = new Blob( [svg], { type: 'image/svg+xml;charset=utf-8' } );
            const svgObjectUrl = URL.createObjectURL( svgBlob );

            const tempImg = new Image();
            
            // If you have more than one GraphIt object, the labels images will be written to the last graph that is rendered, 
            // unless you refer to the specific graphing context (ctx) as a local variable (ctxLoc)
            var ctxLoc = ctx;  
            tempImg.addEventListener( 'load', function() {
                ctxLoc.drawImage( tempImg, xPos, yPos, scaleWidth,scaleHeight);
                URL.revokeObjectURL( svgObjectUrl );
            } );

            tempImg.src = svgObjectUrl;
            return tempImg;
        }
        
        function renderEqnImageToCanvas(img,pos) { // For rendering cached equation images
            const xPos = pos[0];
            const yPos = pos[1];
            const scaleWidth = c.width*8;
            const scaleHeight = c.height*8;

            ctx.beginPath();
            ctx.drawImage( img, xPos, yPos, scaleWidth,scaleHeight);
        }

        
        function RenderZeroLines() {
            
            ctx.strokeStyle = "black";
            ctx.lineWidth = 4;

            // X-line for zero
            if (scaleX[0]<0 && scaleX[1]>0) {
                ctx.beginPath();
                ctx.moveTo(xpos(0),ypos(scaleY[0]));
                ctx.lineTo(xpos(0),ypos(scaleY[1]))
                ctx.stroke();
            }

            // Y-line for zero
            if (scaleY[0]<0 && scaleY[1]>0) {
                ctx.beginPath();
                ctx.moveTo(xpos(scaleX[0]),ypos(0));
                ctx.lineTo(xpos(scaleX[1]),ypos(0));
                ctx.stroke();
            }
        }

        
        function RenderData() {
            const names = dataObj.names;
            const lineColours = dataObj.lineColours;
            const nNames = names.length;
            const X = dataObj.X;
            const xName = dataObj.xName;

            // Number of datasets
            for (i = 0; i < nNames; i++) {
                const currentName = names[i];
                const currentData = dataObj[currentName];

                ctx.lineWidth = 8;
                ctx.strokeStyle = lineColours[i];
                ctx.beginPath();
                ctx.moveTo(xpos(X[0]), ypos(currentData[0]));
                // Write data
                for (j = 1; j < X.length; j++) {
                    let x = xpos(X[j]);
                    let y = ypos(currentData[j]);
                    ctx.lineTo(x, y);
                }
                ctx.stroke();
            }
        }

        function renderXTicks() {
            xMin = scaleX[0];
            xMax = scaleX[1];
                // Avoid Math.abs due to float-point mania

            OOM10 = OOM(xDist);			// Order of magnitude for prime ticks
            OOM5 = OOM10/2;				// Order of magnitude for five-ticks
            OOM1 = OOM10/10;			// Order of magnitude for ten-ticks

            totalTicks = 0;
            nPrimaryTicksX = 0;			// Counts number of primary ticks
            nSecondaryTicksX = 0;		// Counts number of five-ticks
            nTertiaryTicksX = 0;		// Counts number of ten-ticks
            pX = -Infinity;				// Starting place on number line

            /* Primary ticks */
            while (pX<=xMax) { 
                // Determine tick position
                pX = xMin - xMin%OOM10 + OOM10*nPrimaryTicksX;
                pX = strip(pX)

                if (pX>xMax) break;

                // Draw X ticks 
                ctx.strokeStyle = "black";
                ctx.beginPath();

                newTickXPos = xpos(pX);
                ctx.moveTo(newTickXPos+tickWidth/4, yChartEnd);
                ctx.lineTo(newTickXPos+tickWidth/4, yChartEnd + tickSize);
                ctx.stroke();

                // Draw X Labels
                label = String(pX);
                ctx.font = axesFontSize*tickFontFactor + "px " + axesFont;
                ctx.fillStyle = "black"

                MT = ctx.measureText(label)
                zeroWidth = MT.width;
                actualFontSize = (MT.actualBoundingBoxAscent+MT.actualBoundingBoxDescent);

                xPos = newTickXPos - zeroWidth/2;
                yPos = yChartEnd + tickSize + actualFontSize+5;
                ctx.fillText(label, xPos, yPos);	

                nPrimaryTicksX++; // To the next thing
            } 
            totalTicks = nPrimaryTicksX; //update tick counter;

            /* Minor Secondary Ticks*/
            if (nPrimaryTicksX<=5) {
                pX = -Infinity;

                while (pX<=xMax) {
                    // Determine tick position
                    pX = xMin - xMin%OOM5 + OOM5*nSecondaryTicksX;
                    pX = strip(pX)

                    if (pX>xMax) break; 

                    if (pX%OOM10!=0) { // Don't overwrite ten-ticks
                        // Draw X ticks 
                        ctx.strokeStyle = "grey";
                        ctx.beginPath();

                        newTickXPos = xpos(pX);
                        ctx.moveTo(newTickXPos+tickWidth/4, yChartEnd);
                        ctx.lineTo(newTickXPos+tickWidth/4, yChartEnd + tickSize);
                        ctx.stroke();

                        // Draw X Labels
                        label = String(pX);
                        ctx.font = axesFontSize*tickFontFactor + "px " + axesFont;
                        ctx.fillStyle = "grey"

                        MT = ctx.measureText(label)
                        zeroWidth = MT.width;
                        actualFontSize = (MT.actualBoundingBoxAscent+MT.actualBoundingBoxDescent);

                        xPos = newTickXPos - zeroWidth/2;
                        yPos = yChartEnd + tickSize + actualFontSize+5;
                        ctx.fillText(label, xPos, yPos);	

                        totalTicks++; // Only include ticks actually made
                    }

                    nSecondaryTicksX++; // To the next thing
                }
            }

            /* Minor Tertiary Ticks*/
            if (nPrimaryTicksX<=5 && totalTicks<=6) {
                pX = -Infinity;

                while (pX<=xMax) {
                    pX = xMin - xMin%OOM1 + OOM1*nTertiaryTicksX;
                    pX = strip(pX)

                    if (pX>xMax) break; 

                    if (pX%OOM10!=0 && pX%OOM5!=0) { // Don't overwrite ten-ticks or five-ticks
                        // Draw X ticks 
                        ctx.strokeStyle = "grey";
                        ctx.beginPath();

                        newTickXPos = xpos(pX);
                        ctx.moveTo(newTickXPos+tickWidth/4, yChartEnd);
                        ctx.lineTo(newTickXPos+tickWidth/4, yChartEnd + tickSize*0.8);
                        ctx.stroke();

                        totalTicks++; // Only include ticks actually made
                    }
                    
                    nTertiaryTicksX++;
                }

            }


        }		
        
        function renderYTicks() {
            yMin = scaleY[0];
            yMax = scaleY[1];
            yDist = yMax-yMin;
            if (yDist<0) yDist = -yDist; 

            OOM10 = OOM(yDist);
            OOM5 = OOM10/2;
            OOM1 = OOM10/10;

            totalTicks = 0;
            nPrimaryTicksY = 0;			// Counts number of primary ticks
            nSecondaryTicksY = 0;		// Counts number of five-ticks
            nTertiaryTicksY = 0;		// Counts number of ten-ticks
            pY = -Infinity

            /* Primary ticks*/
            while (pY<=yMax) {
                // Determine tick position
                pY = yMin - yMin%OOM10 + OOM10*nPrimaryTicksY;
                pY = strip(pY)

                if (pY>yMax) break;

                // Draw Y ticks 
                ctx.strokeStyle = "black";
                ctx.beginPath();

                newTickYPos = ypos(pY);
                ctx.moveTo(xChartStart, newTickYPos);
                ctx.lineTo(xChartStart-tickSize, newTickYPos);
                ctx.stroke();

                // Y labels
                ctx.fillStyle = "black";
                label = String(pY);
                ctx.font = axesFontSize*tickFontFactor + "px " + axesFont;

                MT = ctx.measureText(label)
                zeroWidth = MT.width;
                actualFontSize = (MT.actualBoundingBoxAscent+MT.actualBoundingBoxDescent);

                xPos = xChartStart - tickSize - zeroWidth - 3;
                yPos = ypos(pY) + actualFontSize/2 - tickWidth/2;
                ctx.fillText(label, xPos, yPos);

                nPrimaryTicksY++;
            }
            totalTicks = nPrimaryTicksY;

            /* Secondary ticks */
            if (nPrimaryTicksY<=5) {
                pY = -Infinity;

                while (pY<=yMax) {
                    // Determine tick position
                    pY = yMin - yMin%OOM5 + OOM5*nSecondaryTicksY;
                    pY = strip(pY); // Floating point issues blah

                    if (pY>yMax) break;

                    if (pY%OOM10!=0) {
                        // Draw y Ticks
                        ctx.strokeStyle = "grey";
                        ctx.beginPath();

                        newTickYPos = ypos(pY);
                        ctx.moveTo(xChartStart, newTickYPos);
                        ctx.lineTo(xChartStart-tickSize, newTickYPos);
                        ctx.stroke();		
                        
                        // Draw y labels
                        ctx.fillStyle = "grey";
                        label = String(pY);
                        ctx.font = axesFontSize*tickFontFactor + "px " + axesFont;

                        MT = ctx.measureText(label)
                        zeroWidth = MT.width;
                        actualFontSize = (MT.actualBoundingBoxAscent+MT.actualBoundingBoxDescent);

                        xPos = xChartStart - tickSize - zeroWidth - 3;
                        yPos = ypos(pY) + actualFontSize/2 - tickWidth/2;
                        ctx.fillText(label, xPos, yPos);

                        totalTicks++;
                    }
                    nSecondaryTicksY++;
                    
                }

            }
            
            /* Tertiary ticks */
            if (nPrimaryTicksY<=5 && totalTicks<=6) {
                pY = -Infinity;

                while (pY<=yMax) {
                    // Determine tick position
                    pY = yMin - yMin%OOM1 + OOM1*nTertiaryTicksY;
                    pY = strip(pY)
                    
                    if (pY>yMax) break;

                    if (pY%OOM10!=0 && pY%OOM5!=0) {
                        // Draw y Ticks
                        ctx.strokeStyle = "grey";
                        ctx.beginPath();

                        newTickYPos = ypos(pY);
                        ctx.moveTo(xChartStart, newTickYPos);
                        ctx.lineTo(xChartStart-tickSize*0.8, newTickYPos);
                        ctx.stroke();		

                        totalTicks++;
                    }
                    nTertiaryTicksY++;
                    
                }

            }
        }

        /* renderAxes(): draw axes labels, ticks - positioning has already been done*/
        function renderAxes(obj) {
            ctx.fillStyle = "black";

            obj = {
                supressZeroX: false,
                supressZeroY: false,
            }

            ctx.strokeStyle = "black";
            ctx.lineWidth = axisLineThickness;
            /// Y-axis
            ctx.beginPath();
            ctx.moveTo(xChartStart, yChartStart);
            ctx.lineTo(xChartStart, yChartEnd);
            ctx.stroke();

            /// X-axis
            ctx.beginPath();
            ctx.moveTo(xChartStart, yChartEnd);
            ctx.lineTo(xChartEnd, yChartEnd);
            ctx.stroke();

            /// Title 
            ctx.font = titleFontSize + "px " + titleFont;
            xPos = titlePosition.x;
            yPos = titlePosition.y;
            ctx.fillText(title, xPos, yPos);

            /// X-Label
            ctx.font = axesFontSize + "px " + axesFont;
            xPos = xLabelPosition.x;
            yPos = xLabelPosition.y;
            ctx.fillText(xLabel, xPos, yPos);

            /// Y-Label
            ctx.font = axesFontSize + "px " + axesFont;
            xPos = yLabelPosition.x;
            yPos = yLabelPosition.y;
            ctx.fillText(yLabel, xPos, yPos);

            /// y-intercept
            // yInterceptWidth = ctx.measureText(yIntercept).width;
            
            // MT = ctx.measureText(yIntercept)
            // zeroWidth = MT.width;
            // actualFontSize = (MT.actualBoundingBoxAscent+MT.actualBoundingBoxDescent);

            // xPos = xChartStart - tickSize - zeroWidth;
            // yPos = ypos(A[0])+actualFontSize/4;

            // ctx.font = axesFontSize*tickFontFactor + "px " + axesFont;
            // ctx.fillStyle = "red";
            // ctx.strokeStyle = "white";

            // ctx.lineWidth = 15;
            // ctx.strokeText(yIntercept, xPos, yPos);
            // ctx.lineWidth = 1;
            // ctx.fillText(yIntercept, xPos, yPos);
        }

        function RenderFills() {
            var fills = dataObj.fills;
            var fillPos = dataObj.fillPositions;

            /* fills = ["red","black"],
            fillPositions = [
                [0,0,5,5],
                [10,10,15,15]
            ],
             */

            for (let i = 0; i < fills.length; i++) {
                var pos = fillPos[i];
                var colour = fills[i];

                var x0 = xpos(pos[0]);
                var y0 = ypos(pos[1]);
                var x1 = xpos(pos[2]);
                var y1 = ypos(pos[3]);

                Fill([x0,y0,x1,y1],colour);
            }

        }

        function Fill(pos,colour) { // Simple square fill
            var x0 = pos[0];
            var y0 = pos[1];
            var x1 = pos[2];
            var y1 = pos[3];

            ctx.fillStyle = colour;
            ctx.beginPath();
            ctx.moveTo(x0,y0);
            ctx.lineTo(x1,y0);
            ctx.lineTo(x1,y1);
            ctx.lineTo(x0,y1);
            ctx.closePath();
            ctx.fill();

        }

        /* Render order */
        if (dataObj.fills != undefined) RenderFills();
        if (dataObj.names != undefined) RenderData();
        RenderZeroLines();

        if (dataObj.xLines != undefined) drawXLines();
        if (dataObj.yLines != undefined) drawYLines();
        if (dataObj.points != undefined) drawPoints();

        if (dataObj.legendPosition != undefined) RenderLegendBackground();

        if (dataObj.equations != undefined) {
            if (this.cache.equations.length==0) this.cache.equations = RenderEquationLegend(); 
            else RenderEquationLegend(true,this.cache.equations); // Rerender using cached equations 
        }

        renderXTicks();
        renderYTicks();
        renderAxes();
        
        if (dataObj.labels != undefined ) { // if labels field exists
            if (this.cache.labels.length==0) this.cache.labels = RenderLabels();
            else RenderLabels(true,this.cache.labels);
        }
        
        


        

        /* END Render order */


    } else {
        const errmsg = document.getElementById("ErrorMesage");
        errmsg.innerHTML = "Your browser doesn't support chart graphics. Please use a different browser to view this page.";
    }

    
    function OOM(n) {           // Return the order of magnitude (number of zeros)
        n = Math.abs(n);
        var order = Math.floor(Math.log(n) / Math.LN10 - 0.000000001)
        return Math.pow(10,order);
    }
}

function LogData(data) {      // Take logs of data
    var loggedData = [];
    var N = data.length;

    for (let i = 0; i < N; i++) {
		loggedData[i] = Math.log(data[i]);
	}
    return loggedData;
}

function linspace(min,max,N) { // Implementation of MATLAB's linspace
    var dist = max-min;
    var incr = dist/(N-1);
    var out = [];

    for (let i = 0; i <= N-1; i++) {
        out[i] = min + incr*i;
    }
    return out;
}

function argdef(def,arg) { // Return default value if argument isn't a number
    if(typeof(arg)=="number") return arg;
    else return def;
}

function strip(number) { // Preventing javascript floating point instanity
    return +(parseFloat(number).toPrecision(12));
}
