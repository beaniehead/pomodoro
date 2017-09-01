$(document).ready(function () {
    var timerIntervalMain = 1000; //interval of timer in ms
    var startButton = document.getElementById("start");
    var pauseButton = document.getElementById("pause");
    var resetButton = document.getElementById("reset");
    //interval to increase timers by
    var breakInterval = 1;
    var timerInterval = 5;
    //initial break values
    var breakInitialHours = 0; //not used - could be used if a user input variable is included
    var breakInitialMinutes = 5;
    var breakInitialSeconds = 0; //not used - could be used if a user input variable is included
    //initial timer values
    var initialHours = 0; //does nothing other than set the variavble - doesn't edit the initial settings
    var initialMinutes = 20; //edits the initial timer displayed minute value
    var initialSeconds = 0; //edits the initial timer displayed second value
    document.getElementById("minutesNumber").innerHTML = timerInterval;
    document.getElementById("breakMinutesNumber").innerHTML = breakInterval;
    document.getElementById("breakSetupText").innerHTML = "Break";
    document.getElementById("breakSetupMinutes").innerHTML = breakInitialMinutes;
    document.getElementById("breakSetupSeconds").innerHTML = "00";
    document.getElementById("workSetup").innerHTML = "Work";
    //setting variable for calulcation the total number of seconds in a timer - used to calculate secondary background height
    var totalSeconds = 0;
    var clockHeight = document.getElementById("clock").offsetHeight;
    var increment = 0;
    var backgroundHeight = 0;
    var backgroundPositioned = 0;
    var interval;
    var timeElapsed = 0;
    var timeLeft = 0;
    var timerCounter = Number(document.getElementById("timerCount").innerHTML);
    var breakCounter = Number(document.getElementById("breakCount").innerHTML);
    var timerTimeSeconds = Number(document.getElementById("timerTimeSeconds").innerHTML);
    var breakTimeSeconds = Number(document.getElementById("breakTimeSeconds").innerHTML);
    var totalTimeSeconds = 0;
    var bigClock;
    //setting initial minutes and seconds to above values
    document.getElementById("innerMinutes").innerHTML = initialMinutes;
    document.getElementById("innerSeconds").innerHTML = ("0" + initialSeconds).slice(-2);

    //function to increase timer value by set increment
    document.getElementById("plus").onclick = function () {
        var innerMinutesP = document.getElementById("innerMinutes");
        var innerHoursP = document.getElementById("innerHours");
        if (startButton.classList.contains("initial")) {
            if (Number(innerMinutesP.innerHTML) >= 60 - timerInterval && Number(innerMinutesP.innerHTML) < 60) {
                innerHoursP.innerHTML = Number(innerHoursP.innerHTML) + 1;
                innerMinutesP.innerHTML = "0" + (Number(innerMinutesP.innerHTML) - (60 - timerInterval));
                document.getElementById("hoursSeparator").style.visibility = "visible";
            } else if (Number(innerMinutesP.innerHTML) >= 0 && Number(innerMinutesP.innerHTML) < 10 - timerInterval && innerHoursP.innerHTML > 0) {
                innerMinutesP.innerHTML = "0" + (Number(innerMinutesP.innerHTML) + timerInterval);
            } else {
                innerMinutesP.innerHTML = Number(innerMinutesP.innerHTML) + timerInterval;
            }
        }
    };
    //function to reduce timer by set increment
    document.getElementById("minus").onclick = function () {
        var innerMinutesM = document.getElementById("innerMinutes");
        var innerHoursM = document.getElementById("innerHours");
        if (startButton.classList.contains("initial")) {
            if (Number(innerMinutesM.innerHTML) >= 0 && Number(innerMinutesM.innerHTML < timerInterval) && innerHoursM.innerHTML > 0) {
                innerMinutesM.innerHTML = Number(innerMinutesM.innerHTML) + (60 - timerInterval);
                if (Number(innerHoursM.innerHTML) == 1) {
                    innerHoursM.innerHTML = "";
                    document.getElementById("hoursSeparator").style.visibility = "hidden";
                } else {
                    innerHoursM.innerHTML -= 1;
                }
            } else if (innerMinutesM.innerHTML >= timerInterval && innerMinutesM.innerHTML < 10 + timerInterval && innerHoursM.innerHTML > 0) {
                innerMinutesM.innerHTML = ("0" + (Number(innerMinutesM.innerHTML) - timerInterval));
            } else if (innerMinutesM.innerHTML > timerInterval) {
                innerMinutesM.innerHTML = Number(innerMinutesM.innerHTML) - timerInterval;
            }
        }
    };
    document.getElementById("breakPlus").onclick = function () {
        var breakIncrease = Number(document.getElementById("breakMinutesNumber").innerHTML);
        if (startButton.classList.contains("initial") && breakInitialMinutes <= 60 - breakIncrease) {
            breakInitialMinutes += breakIncrease;
        }
        document.getElementById("breakSetupMinutes").innerHTML = breakInitialMinutes;
    };
    document.getElementById("breakMinus").onclick = function () {
        var breakDecrease = Number(document.getElementById("breakMinutesNumber").innerHTML);
        if (startButton.classList.contains("initial") && breakInitialMinutes > breakDecrease) {
            breakInitialMinutes -= breakDecrease;
        }
        document.getElementById("breakSetupMinutes").innerHTML = breakInitialMinutes;
    };
    //main timer countdown function
    function countDown() {
        timeElapsed += 1;
        var clockSeconds = document.getElementById("innerSeconds");
        var clockMinutes = document.getElementById("innerMinutes");
        var clockHours = document.getElementById("innerHours");
        var timerSeconds = Number(clockSeconds.innerHTML);
        var timerMinutes = Number(clockMinutes.innerHTML);
        var timerHours = clockHours.innerHTML;
        if (!(timerSeconds === 0 && timerMinutes === 0 && timerHours === "")) {
            backgroundHeight += increment;
            backgroundPositioned = "50% " + (clockHeight - backgroundHeight) + "px";
            document.getElementById("clock").style.backgroundPosition = backgroundPositioned;
        }
        //when timer reaches zero
        if (timerSeconds === 0 && timerMinutes === 0 && timerHours === "") {
            //switching from work timer to break timer
            if (document.getElementById("clockText").className == "timer") {
                //main cloock header
                document.getElementById("workSetup").innerHTML = "Break";
                //clock subheader        
                document.getElementById("breakSetupText").innerHTML = "Work";
                if (initialHours > 0) {
                    document.getElementById("breakSetupHours").innerHTML = initialHours + ":";
                }
                document.getElementById("breakSetupMinutes").innerHTML = initialMinutes;
                document.getElementById("breakSetupSeconds").innerHTML = "00";
                //document.getElementById("sessionStatus").innerHTML = "Break";
                timerCounter += 1;
                document.getElementById("timerCount").innerHTML = timerCounter;
                timerMinutes = breakInitialMinutes;
                timerSeconds += 1;
                document.getElementById("clockText").className = "break";
                totalSeconds = timerMinutes * 60 + timerSeconds;
                increment = clockHeight / (totalSeconds - 1);
                document.getElementById("remainDisplay").innerHTML = "/" + timerMinutes + ":" + ("0" + (timerSeconds - 1)).slice(-2);
                breakTimeSeconds -= 1;
                totalTimeSeconds -= 1;
                //switching from break timer to work timer
            } else if (document.getElementById("clockText").className == "break") {
                //main clock header
                document.getElementById("workSetup").innerHTML = "Work";
                //clock subheader
                document.getElementById("breakSetupText").innerHTML = "Break";
                document.getElementById("breakSetupHours").innerHTML = "";
                document.getElementById("breakSetupMinutes").innerHTML = breakInitialMinutes;
                document.getElementById("breakSetupSeconds").innerHTML = "00";
                //document.getElementById("sessionStatus").innerHTML = "Work";
                breakCounter += 1;
                document.getElementById("breakCount").innerHTML = timerCounter;
                timerSeconds = Number(initialSeconds) + 1;
                timerMinutes = Number(initialMinutes);
                timerHours = initialHours;
                totalSeconds = timerHours * 3600 + timerMinutes * 60 + timerSeconds;
                increment = clockHeight / (totalSeconds - 1);
                backgroundHeight = 0;
                backgroundPositioned = "50% " + clockHeight + "px";
                document.getElementById("clockText").className = "timer";
                if (initialHours.length < 1) {
                    document.getElementById("remainDisplay").innerHTML =
                        "/" + initialMinutes + ":" + initialSeconds;
                } else {
                    document.getElementById("remainDisplay").innerHTML =
                        "/" + initialHours + ":" + initialMinutes + ":" + initialSeconds;
                }
                timerTimeSeconds -= 1;
                totalTimeSeconds -= 1;
            }
        }
        //counting total time for Timer sessions - cumulative
        if (document.getElementById("clockText").className == "timer") {
            timerTimeSeconds += 1;
            var timerTimeMinutes = Number(
                document.getElementById("timerTimeMinutes").innerHTML
            );
            var timerTimeHours = document.getElementById("timerTimeHours").innerHTML;
            if (timerTimeSeconds == 60) {
                timerTimeMinutes += 1;
                timerTimeSeconds = 0;
            }
            if (timerTimeMinutes == 60) {
                document.getElementById("timerTimeHoursSep").innerHTML = ":";
                timerTimeHours = Number(timerTimeHours) + 1;
                timerTimeMinutes = 0;
            }
            if (timerTimeHours > 0 && timerTimeMinutes < 10) {
                timerTimeMinutes = "0" + timerTimeMinutes;
            }
            document.getElementById("timerTimeSeconds").innerHTML = ("0" + timerTimeSeconds).slice(-2);
            document.getElementById("timerTimeMinutes").innerHTML = timerTimeMinutes;
            document.getElementById("timerTimeHours").innerHTML = timerTimeHours;
        }
        //counting total time for Break sessions - cumulative
        if (document.getElementById("clockText").className == "break") {
            breakTimeSeconds += 1;
            var breakTimeMinutes = Number(document.getElementById("breakTimeMinutes").innerHTML);
            var breakTimeHours = document.getElementById("breakTimeHours").innerHTML;
            if (breakTimeSeconds == 60) {
                breakTimeMinutes += 1;
                breakTimeSeconds = 0;
            }
            if (breakTimeMinutes == 60) {
                document.getElementById("breakTimeHoursSep").innerHTML = ":";
                breakTimeHours = Number(breakTimeHours) + 1;
                breakTimeMinutes = 0;
            }
            if (breakTimeHours > 0 && breakTimeMinutes < 10) {
                breakTimeMinutes = "0" + breakTimeMinutes;
            }
            document.getElementById("breakTimeSeconds").innerHTML = ("0" + breakTimeSeconds).slice(-2);
            document.getElementById("breakTimeMinutes").innerHTML = breakTimeMinutes;
            document.getElementById("breakTimeHours").innerHTML = breakTimeHours;
        }
        //total overal time (break and work combined)
        totalTimeSeconds += 1;
        var totalTimeMinutes = Number(document.getElementById("totalTimeMinutes").innerHTML);
        var totalTimeHours = document.getElementById("totalTimeHours").innerHTML;
        if (totalTimeSeconds == 60) {
            totalTimeMinutes += 1;
            totalTimeSeconds = 0;
        }
        if (totalTimeMinutes == 60) {
            document.getElementById("totalTimeHoursSep").innerHTML = ":";
            totalTimeHours += Number(totalTimeHours) + 1;
            totalTimeMinutes = 0;
        }
        if (totalTimeHours > 0 && totalTimeMinutes < 10) {
            totalTimeMinutes = "0" + totalTimeMinutes;
        }
        document.getElementById("totalTimeSeconds").innerHTML = ("0" + totalTimeSeconds).slice(-2);
        document.getElementById("totalTimeMinutes").innerHTML = totalTimeMinutes;
        document.getElementById("totalTimeHours").innerHTML = totalTimeHours;
        //use this trigger to loop switch break value
        //if minutes and seconds reach zero, but there are still hours left on time, decrease hours by one, and set minutes and seconds to 59 eachh
        if (timerSeconds === 0 && timerMinutes === 0 && timerHours > 0) {
            timerMinutes = 59;
            timerSeconds = 59;
            timerHours -= 1;
            if (timerHours === 0) {
                timerHours = "";
                document.getElementById("hoursSeparator").style.visibility = "hidden";
            }
        } else if (timerSeconds === 0 && timerMinutes > 0) {
            timerSeconds = 59;
            timerMinutes -= 1;
        } else if (timerSeconds > 0) {
            //needed to ensure the seconds counter doesn't skip from 00 to 58
            timerSeconds += -1;
            timerSeconds = ("0" + timerSeconds).slice(-2);
        }
        if (timerMinutes < 10 && timerHours > 0) {
            timerMinutes = "0" + timerMinutes;
        }
        clockMinutes.innerHTML = timerMinutes;
        clockSeconds.innerHTML = timerSeconds;
        clockHours.innerHTML = timerHours;
    }
    $("#start").click(function () {
        if (document.getElementById("start").className == "initial set btn") {
            document.getElementById("workSetup").innerHTML = "Work";
            document.getElementById("clockText").className = "timer";
        }
        //If timer has not been started yet or has been paused
        if (pauseButton.className == "paused btn") {
            //If timer has not been started for the first time without being reset
            if (startButton.classList.contains("set")) {
                //document.getElementById("breakInfo").style.visibility = "hidden";
                initialSeconds = document.getElementById("innerSeconds").innerHTML;
                initialMinutes = document.getElementById("innerMinutes").innerHTML;
                initialHours = document.getElementById("innerHours").innerHTML;
                if (initialHours === "") {
                    document.getElementById("remainDisplay").innerHTML =
                        "/" + initialMinutes + ":" + initialSeconds;
                } else {
                    document.getElementById("remainDisplay").innerHTML =
                        "/" + initialHours + ":" + initialMinutes + ":" + initialSeconds;
                }
                document.getElementById("remainDisplay").style.visibility = "visible";
                totalSeconds = Number(document.getElementById("innerHours").innerHTML) * 3600 +Number(document.getElementById("innerMinutes").innerHTML) * 60 +Number(document.getElementById("innerSeconds").innerHTML);
                increment = clockHeight / totalSeconds;
                //display work  and break session totals in table
                if (initialHours < 1) {
                    document.getElementById("workSummary").innerHTML = " (" + initialMinutes + ":" + initialSeconds + ")";
                } else {
                    document.getElementById("workSummary").innerHTML =" (" + initialHours + ":" + initialMinutes + ":" + initialSeconds + ")";
                }
                document.getElementById("breakSummary").innerHTML = " (" + breakInitialMinutes + ":00)";
            }
            //increment to increase background with each tick (in pixels)
            pauseButton.className = "unpaused btn";
            startButton.className = "started btn";
            document.getElementById("pausedText").style.visibility = "hidden";
            interval = setInterval(countDown, timerIntervalMain); //the main time interval for the clock - set at beginning of script
        }
    });
    $("#pause").click(function () {
        if (startButton.classList.contains("started")) {
            pauseButton.className = "paused btn";
            document.getElementById("pausedText").style.visibility = "visible";
            //identifies the only time startButton has the single class 'initial'
            if (startButton.className == "started btn") {
                $("#clockText").effect("shake");
            }
            clearInterval(interval);
        }
    });
    $("#reset").click(function () {
        //allows a reset in all conditions except for initial conditions - prevents multiple resetting without startiung again
        if (startButton.className != "initial set btn") {
            totalTimeSeconds = 0;
            timerTimeSeconds = 0;
            breakTimeSeconds = 0;
            timeElapsed = 0;
            startButton.className = "initial set btn";
            pauseButton.className = "paused btn";
            document.getElementById("totalTimeHours").innerHTML = "";
            document.getElementById("totalTimeMinutes").innerHTML = 0;
            document.getElementById("totalTimeSeconds").innerHTML = "00";
            document.getElementById("timerTimeHours").innerHTML = "";
            document.getElementById("timerTimeMinutes").innerHTML = 0;
            document.getElementById("timerTimeSeconds").innerHTML = "00";
            document.getElementById("breakTimeHours").innerHTML = "";
            document.getElementById("breakTimeMinutes").innerHTML = 0;
            document.getElementById("breakTimeSeconds").innerHTML = "00";
            document.getElementById("workSetup").innerHTML = "Work";
            document.getElementById("breakInfo").style.visibility = "visible";
            document.getElementById("breakSummary").innerHTML = "";
            document.getElementById("workSummary").innerHTML = "";
            document.getElementById("remainDisplay").innerHTML = "/";
            document.getElementById("remainDisplay").style.visibility = "hidden";
            document.getElementById("timerCount").innerHTML = 0;
            document.getElementById("timerTimeHoursSep").innerHTML = "";
            document.getElementById("breakTimeHoursSep").innerHTML = "";
            document.getElementById("totalTimeHoursSep").innerHTML = "";
            document.getElementById("breakCount").innerHTML = 0;
            document.getElementById("pausedText").style.visibility = "hidden";
            document.getElementById("innerSeconds").innerHTML = ("0" + initialSeconds).slice(-2);
            document.getElementById("innerMinutes").innerHTML = initialMinutes;
            document.getElementById("innerHours").innerHTML = initialHours;
            if (initialHours > 0) {
                document.getElementById("hoursSeparator").style.visibility = "visible";
            }
            backgroundHeight = 0;
            backgroundPositioned = "50% " + clockHeight + "px";
            document.getElementById("clock").style.backgroundPosition = backgroundPositioned;
            clearInterval(interval);
        }
    });
    $(".settingsButton").on("click", function () {
        $(".settings").css("z-index", "0");
        $(".settings").css("opacity", "0");
        $(".details").css("z-index", "2");
        $(".details").css("opacity", "1");
        // $("#infoTable").css("z-index", "-1");
        $("#infoTable").css("opacity", "0");
    });
    $(".closer").click(function () {
        $(".settings").css("z-index", "1");
        $(".settings").css("opacity", "1");
        $(".details").css("z-index", "-1");
        $(".details").css("opacity", "0");
        $("#infoTable").css("opacity", "1");
    });
    $(".lightOn").click(function () {
        clockHeight = $("#clock").height();
        $(".darkOn").css({
            "background-color": "#CBCEDD",
            color: "#222534",
            "font-weight": "normal"
        });
        $(".darkOn").attr("id", "inactive");
        $(".lightOn").attr("id", "active");
        $(".lightOn").css({
            "background-color": "gold",
            color: "#222534",
            "font-weight": "bold"
        });

        $("body").css({
            background: "#ffffff"
        });

        $("#main").css({
            background: "#fff",
            color: "#444"
        });
        $("#clock").css({
            background:
            "url('https://s-media-cache-ak0.pinimg.com/736x/b6/dd/88/b6dd887b757aaa071d919752f4222ccd--my-spring-key-lime.jpg') no-repeat",
            "background-position": "50%" + (clockHeight - backgroundHeight) + "px",
            "background-size": clockHeight + 20 + "px " + clockHeight + "px"
        });
        $("#infoTable").css("color", "#444");
        $("#clock").css("color", "#444");
    });
    $(".darkOn").click(function () {
        clockHeight = $("#clock").height();
        $(".lightOn").css({
            "background-color": "#CBCEDD",
            color: "#222534",
            "font-weight": "normal"
        });
        $(".lightOn").attr("id", "inactive");
        $(".lightOn").css("color", "#222534");
        $(".darkOn").attr("id", "active");
        $(".darkOn").css({
            "background-color": "#000066",
            color: "#CBCEDD",
            "font-weight": "bold"
        });

        $("body").css({
            background: "#000066"
        });

        $("#main").css({
            background: "#000066",
            color: "#ddd"
        });
        $("#clock").css({
            background:
            "url('https://www.gov.uk/government/uploads/system/uploads/attachment_data/file/252471/orange.jpg') no-repeat",
            color: "#fff",
            "background-position": "50%" + (clockHeight - backgroundHeight) + "px",
            "background-size": clockHeight + 20 + "px " + clockHeight + "px"
        });
        $("#infoTable").css("color", "#ddd");
    });
    //maximise and minimise the clock
    //need to change font size and the button label and maximise size
    $("#maximiser").click(function () {
        if ($(window).width() > 500) {
            bigClock = 550;
        } else {
            bigClock = $(window).width() - 20;
        }
        var smallClock = 300;
        var clockRatios = bigClock / smallClock;
        if ($("#maximiser").hasClass("notActive")) {
            $("#maximiser").html("Minimise");
            $("#infoTable").css({
                visibility: "hidden",
                display: "none"
            });
            $("#bothTimerControls").css({
                visibility: "hidden",
                display: "none"
            });
            $("#maximiser").addClass("nowActive").removeClass("notActive");
            $("#clock").height(bigClock + "px").width(bigClock + "px");
            clockHeight = $("#clock").height();
            $("#clock").css({
                "background-size": bigClock + 20 + "px " + bigClock + "px",
                "font-size": clockRatios + "em"
            });
            backgroundHeight = backgroundHeight * clockRatios;
            increment = increment * clockRatios;
            $("#clock").css(
                "background-position",
                "50% " + (clockHeight - backgroundHeight) + "px"
            );
        } else if ($("#maximiser").hasClass("nowActive")) {
            $("#maximiser").html("Maximise");
            $("#infoTable").css({
                visibility: "visible",
                display: ""
            });
            $("#bothTimerControls").css({
                visibility: "visible",
                display: ""
            });
            $("#maximiser").addClass("notActive").removeClass("nowActive");
            $("#clock").height(smallClock + "px").width(smallClock + "px");
            clockHeight = $("#clock").height();
            $("#clock").css({
                "background-size": smallClock + 20 + "px " + smallClock + "px",
                "font-size": "1em"
            });
            increment = increment / clockRatios;
            backgroundHeight = backgroundHeight / clockRatios;
            $("#clock").css(
                "background-position",
                "50% " + (clockHeight - backgroundHeight) + "px"
            );
        }
    });
});