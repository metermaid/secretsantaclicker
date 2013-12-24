$( document ).ready(function() {
// mostly based on click click

//variables
var player = {
    clicks: 0,
    autoclicks: 0,
    autoclicker_2: 0,
    cost: 10,
    cost_2: 1000,
    upgrade_speed: 0,
    click_bonus: 0,
    click_rate: 1000,
    interval_auto: null};

var arr =
    [
    "Tools make Gifts faster! Did I say Tools? I mean people.",
    "Hohoho. Merry Christmas, brought to you by HSBC.",
    "Did you complete your anti-money laundering training?",
    "I just gave birth to some snow bears.",
    "Suck louder please.",
    "You should try stalking people at the mall. It's really interesting.",
    "When you're my friend, why would I need to be invited to sleep over? Why can't I just show up at your door?",
    "Why do we cry when we get hurt?",
    "No, you're not allowed to telecommute from the North Pole.",
    "Boy, I sure do love Excel.",
    "I bet I could beat you in Mario Kart.",
    "Who's Leonard Cohen? A gangster?",
    "Who's up for a fundraiser?",
    "How's that work term report coming?",
    "How are ALL the microwaves in use?",
    "Anybody up for a game of L4D2?",
    "There are no 'chauns here."
    ]
//functions
function team_lunch_formula(value) {
    return Math.floor(100 * Math.pow(1.2, value));
}

function click_bonus_price(value) {
    return Math.pow(3, value) * 300;
}

function speed_bonus_price(value) {
    return Math.pow(3, value) * 100;
}

function update_total_clicks() { //updates the number of player.clicks   
    $("#total_clicks").text(player.clicks);
}
function buy_something(c, button) {
    if (player.clicks < c) {
        return false;
    }
    player.clicks -= c;
    return true;
}
function update_workers() {
    $("#time_period").text(parseFloat(player.click_rate/1000.0).toFixed(2));
    clearInterval(player.interval_auto);
    player.interval_auto = setInterval(function () { 
        player.clicks += player.autoclicks + player.autoclicker_2 * 10;
        update_total_clicks(); 
    }, player.click_rate);
}
function set_cookie(c_name,value) {
        expiry = new Date();   
        expiry.setTime(new Date().getTime() + (10*60*1000)); 
        var c_value=escape(btoa(JSON.stringify(value))) + "; expires="+expiry.toUTCString();
        document.cookie=c_name + "=" + c_value;
}
function get_cookie(cookie_name) {
    var c_value = document.cookie;
    var c_start = c_value.indexOf(" " + cookie_name + "=");
    if (c_start == -1) {
        c_start = c_value.indexOf(cookie_name + "=");
    }
    if (c_start == -1) return false;
    c_start = c_value.indexOf("=", c_start) + 1;
    var c_end = c_value.indexOf(";", c_start);
    if (c_end == -1) {
        c_end = c_value.length;
    }
    c_value = JSON.parse(atob(unescape(c_value.substring(c_start,c_end))));
    return c_value;
}

function update_view() {
    $("#speed_level").text(player.upgrade_speed + ' COFFEES');
    $("#click_level").text(player.click_bonus + ' Wiis');

    $("#clicks_per_second").text(player.autoclicks + 10 * player.autoclicker_2);

    $("#upgrade_speed").text('Trade for ' + speed_bonus_price(player.upgrade_speed) + ' Gifts');
    $("#upgrade_click").text('Trade for ' + click_bonus_price(player.click_bonus) + ' Gifts');
    $("#buy_click").text('Trade for ' + player.cost + ' Gifts');
    $("#buy_click2").text('Trade for ' + player.cost_2 + ' Gifts');

    $("#team_lunch").text("Team Lunch! Make " + team_lunch_formula(player.autoclicks) + " Presents!");

    $("#autoclicker_level").text(player.autoclicks + ' Students Toiling Away');
    $("#autoclicker2_level").text(player.autoclicker_2 + ' Full Timers Working Hard');
    update_total_clicks();
    update_workers();
    if (player.click_bonus > 3)
        $('#upgrade_click').hide();
    if (player.upgrade_speed > 5)
        $('#upgrade_speed').hide();
}
function save_game() {
    localStorage['clickclick_save'] = btoa(JSON.stringify(player));
}
    
function load_game() {
    if (!localStorage['clickclick_save']) return;
    var save_data = JSON.parse(atob(localStorage['clickclick_save']));
    player = save_data;
    update_view();
}

function display_lunch() {
    $("#team_lunch").show();
    $("#team_lunch").text("Team Lunch! Make " +  team_lunch_formula(player.autoclicks) + " Presents!");
}

function display_text() {
    var roll = (Math.floor(Math.random() * arr.length));
    $("#random").text(arr[roll]);
}


//click events
$("#click").click(function() {  
    player.clicks += Math.pow(2,player.click_bonus); 
    update_total_clicks(); //updates the text
});

$("#team_lunch").click(function() {  
    player.clicks += team_lunch_formula(player.autoclicks); 
    update_total_clicks(); //updates the text
    $(this).hide();    
});

$("#buy_click").click(function() {  
    if (!buy_something(player.cost, this)) return;
    player.autoclicks++; 
    player.cost = 10 * Math.ceil(Math.pow(1.5, player.autoclicks)); //new player.cost
    update_view();
    save_game();
});

$("#buy_click2").click(function() {  
    if (!buy_something(player.cost_2, this)) return;
    player.autoclicker_2++; 
    player.cost_2 = 1000 * Math.ceil(Math.pow(1.8, player.autoclicker_2)); //new player.cost
    update_view();
    save_game();
});

$("#upgrade_speed").click(function() {  
    if (!buy_something(speed_bonus_price(player.upgrade_speed), this)) return;
    player.upgrade_speed++; 
    player.click_rate = 1000 - (player.upgrade_speed * 100);
    update_view();
    save_game();
});
$("#upgrade_click").click(function() {  
    if (!buy_something(click_bonus_price(player.click_bonus), this)) return;
    player.click_bonus++; 
    update_view();
    save_game();
});

$("#ss_gift").click(function() {
    var clickz = player.clicks;
    if (!buy_something(1000000, this)) return;
    $.post("send.php", {clicks: clickz, coops: player.autoclicks, fters: player.autoclicker_2},
    function(data) { 
        alert("Yay! Congratulations! Expect your gift emailed to you within 24 hours!");
        save_game();
    });
    update_view();
    $(this).parent(".item").hide();
});

load_game(); //attempt to load the game
//start our autoclickers
update_workers();
setInterval(function () { save_game(); }, 10000);
setInterval(function () { display_text(); }, 8000);
setInterval(function () { display_lunch(); }, 35555);
$("#team_lunch").hide();
});