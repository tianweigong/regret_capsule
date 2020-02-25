var ins_pages=["ins_pre","ins1","ins2","train"];
// var check_keys=[true,false,false,true,true,true];
var insPage=0;
var trialNumber=-1;//begin with click training(-1), and then practice trial(0)
var data=new Array;
var beginTime=0;
var myABI=0;
var trainFlag=0;
var machine_num=1;
var iv_num=0
var iv_limit=12
var video_time=66000
var row_num=0
var blinkFlag=0
var blink_limit=4
var train_array=[0,20,5,20,40,5,60,40,60,20,40,20,40];
var rough_array=[0,5,20,5,40,60,5,20,20,20,100,60,140];
var smooth_array=[0,5,20,5,40,60,5,20,20,20,40,20,20];
var display_reward=0
var target_array=train_array
var quesFlag=0
var cf_value=-1
var regret_value=-1
document.getElementById("instruction").style.display="block";
document.getElementById("experiment").style.display="none";
document.getElementById("survey").style.display="none";
document.getElementById("experiment_finished").style.display="none";

//condition
var condi_list=[0,1,2,3,4,5]
var condi_name=["short_do","long_rough_do","long_smooth_do",
				"short_indo","long_rough_indo","long_smooth_indo"]
var myCon=shuffle(condi_list)[0]
console.log(myCon)
if (myCon==0 ||myCon==3 ){
	iv_limit=6
	video_time=33000
}
if (myCon>=3){
	document.getElementById("regret_item").innerHTML="<p>1.From the summary, we can see that in the sixth round Max didn't switch to the next machine (see the indication in the figure above).<b>To what extent do you think Max would regret for his decision in the sixth round?</b></p>"
	document.getElementById("cf_item").innerHTML="2. How much reward you think Max could gain for the sixth round if he did switch to the next machine (that is to say, how much reward you think it is in the blue framework of the figure above)?"
}

document.getElementById("frame_video").innerHTML="<video width='600' height='700' controls><source src='static/media/"+condi_name[myCon]+".mp4' type='video/mp4'>Your browser does not support the video tag.</video>"
document.getElementById("regret_img_frame").innerHTML="<img id='regret_img' src='static/media/regret/"+condi_name[myCon]+".png'>"
document.getElementById("cf_img_frame").innerHTML="<img id='cf_img' src='static/media/counterfactual/"+condi_name[myCon]+".png'>"

document.getElementById("display_chance").innerHTML="Chances Left: "+Number(iv_limit)
$(".round_total").html(iv_limit);

//condition-end



for(var i=1;i<ins_pages.length;i++){
	document.getElementById(ins_pages[i]).style.display="none";
}

ipcheck();


function InsNextClick(){

	for(var i=0;i<ins_pages.length;i++){
		document.getElementById(ins_pages[i]).style.display="none";
	}
	insPage=insPage+1;

	if (insPage>=ins_pages.length){
		ShowExp()
		return;
	}
	document.getElementById(ins_pages[insPage]).style.display="block";

	document.getElementById("ins_forward").disabled=false;

	if (ins_pages[insPage]=="train" && trainFlag==0){
		document.getElementById("ins_forward").disabled=true;
	}
}

document.getElementById("button_training_next").disabled=true;


for(var i=1;i<=12;i++){
	myid="m"+i
	document.getElementById(myid).style.visibility="hidden";
	myid="n"+i
	document.getElementById(myid).style.visibility="hidden";
}

function anima_choose_this(){
	row_num=row_num+1
	iv_num=iv_num+1
	document.getElementById("rewards_hint").innerHTML="+$"+target_array[iv_num];
	blinkFlag=blinkFlag+1
	setTimeout(BlinkOn,500);
	setTimeout(choose_this,3000);

	document.getElementById("button_training_next").disabled=true;
	document.getElementById("button_training_this").disabled=true;
	setTimeout(please_choose,3000);

}

function BlinkOn(){
	document.getElementById("frame_capsule").style.visibility="visible";
	blinkFlag=blinkFlag+1
	if (blinkFlag<=blink_limit){
		setTimeout(BlinkOff,500);
	}else{
		blinkFlag=0
	}
}	

function BlinkOff(){
	document.getElementById("frame_capsule").style.visibility="hidden";
	blinkFlag=blinkFlag+1
	if (blinkFlag<=blink_limit){
		setTimeout(BlinkOn,500);
	}else{
		blinkFlag=0
	}
}

function please_choose(){
	if (iv_num<iv_limit){
		document.getElementById("button_training_next").disabled=false;
		document.getElementById("button_training_this").disabled=false;
	}else{
		document.getElementById("ins_forward").disabled=false;
	}
}

function anima_choose_next(){
	machine_num=machine_num+1
	iv_num=iv_num+1
	row_num=row_num+1

	document.getElementById("rewards_hint").innerHTML="+$"+target_array[iv_num];
	blinkFlag=blinkFlag+1

	document.getElementById("frame_machine").style.visibility="hidden"
	document.getElementById("frame_machine").innerHTML="<img class='machine_img' src='static/images/P"+machine_num+".png'>"

	setTimeout(anima_choose_next_part2,500)


}

function anima_choose_next_part2(){
	document.getElementById("frame_machine").style.visibility="visible"
	setTimeout(BlinkOn,1000);
	setTimeout(choose_next,3000);

	document.getElementById("button_training_next").disabled=true;
	document.getElementById("button_training_this").disabled=true;
	setTimeout(please_choose,3000);
}


function choose_this(){

	for(var i=1;i<=machine_num;i++){
	myid="m"+i
	document.getElementById(myid).style.visibility="visible";
	}

	for(var i=1;i<machine_num;i++){
		document.getElementById("tr"+row_num).innerHTML=document.getElementById("tr"+row_num).innerHTML+"<td class='num_small'>&nbsp</td>"
	}
	
	document.getElementById("tr"+row_num).innerHTML=document.getElementById("tr"+row_num).innerHTML+"<td class='num_small'>"+"$"+target_array[iv_num]+"</td>"

	document.getElementById("button_training_next").disabled=false;
	if (iv_num>=iv_limit){
		document.getElementById("button_training_next").disabled=true;
		document.getElementById("button_training_this").disabled=true;
	}

	display_reward=display_reward+target_array[iv_num]
	document.getElementById("display_reward").innerHTML="Rewards: $"+Number(display_reward)
	document.getElementById("display_chance").innerHTML="Chances Left: "+Number(iv_limit-iv_num)
	document.getElementById("display_machine").innerHTML="The Current Machine Number: "+Number(machine_num)

}

function choose_next(){

	for(var i=1;i<=machine_num;i++){
	myid="m"+i
	document.getElementById(myid).style.visibility="visible";
	}

	for(var i=1;i<machine_num;i++){
		document.getElementById("tr"+row_num).innerHTML=document.getElementById("tr"+row_num).innerHTML+"<td class='num_small'>&nbsp</td>"
	}
	

	document.getElementById("tr"+row_num).innerHTML=document.getElementById("tr"+row_num).innerHTML+"<td class='num_small'>"+"$"+target_array[iv_num]+"</td>"

	if (iv_num>=iv_limit){
		document.getElementById("button_training_next").disabled=true;
		document.getElementById("button_training_this").disabled=true;
	}

	display_reward=display_reward+target_array[iv_num]
	document.getElementById("display_reward").innerHTML="Rewards: $"+Number(display_reward)
	document.getElementById("display_chance").innerHTML="Chances Left: "+Number(iv_limit-iv_num)
	document.getElementById("display_machine").innerHTML="The Current Machine Number: "+Number(machine_num)

}


function ShowExp(){
	document.getElementById("instruction").style.display="none";
	document.getElementById("experiment").style.display="block";
	document.getElementById("exp_start").disabled=true;
	document.getElementById("next_question").style.display="none";
	document.getElementById("regret").style.display="none";
	document.getElementById("counterfactual").style.display="none";

	setTimeout(ExpEnable,video_time) //remember to change it!!
}

function ExpEnable(){
	document.getElementById("exp_start").disabled=false;

}


function TrialStart(){
	document.getElementById("next_question").style.display="block";
	document.getElementById("regret").style.display="block";
	document.getElementById("exp_start").style.display="none";
	document.getElementById("next_question").disabled=true;

}

function regret_check(){
	document.getElementById("next_question").disabled=false;
}


function cf_check(){
	cf_value=document.getElementById("cf_rating").value
	if ((!isNaN(cf_value)) && cf_value>=0){
		document.getElementById("next_question").disabled=false;
	}
}


function NextQuestion(){
	quesFlag=quesFlag+1

	if (quesFlag==1){
		regret_value=document.getElementById("regret_rating").value
	}
	document.getElementById("regret").style.display="none";
	document.getElementById("counterfactual").style.display="block";
	document.getElementById("next_question").disabled=true;
	if (quesFlag==2){
		cf_value=document.getElementById("cf_rating").value
		document.getElementById("experiment").style.display="none";
		document.getElementById("survey").style.display="block";

	}	
}


function SaveData(){
	myABI=Math.random().toString(36).substring(2, 4)+["a","6"][Number(Math.random()>0.5)]+Math.random().toString(36).substring(2, 6)+["p","m"][Number(Math.random()>0.5)]+Math.random().toString(36).substring(2, 3);
	var subject=myABI;
	var age=document.getElementById("age").value;
	var feedback=document.getElementById("text_feedback").value;

	var e = document.getElementById("gender");
	var gender=e.options[e.selectedIndex].value;
	var e = document.getElementById("engaging");
	var engaging=e.options[e.selectedIndex].value;
	var e = document.getElementById("difficult");
	var difficult=e.options[e.selectedIndex].value;
	
	var mycondition=myCon;
	var myregret=regret_value;
	var mycf=cf_value;

	jQuery.ajax({
		url: 'static/php/save_data.php',
		type:'POST',
		data:{subject:subject,
			age:age,
			feedback:feedback,
			gender:gender,
			engaging:engaging,
			difficult:difficult,
			mycondition:mycondition,//using trial_order for order 
			myregret:myregret,
			mycf:mycf},
		success:function(data)
		{
			console.log('Sent data to database');
			FinishExp();
		},
		error:function(xhr, status, error)
		{
			//Just print out what comes back if it doesn't work
			console.log(xhr, status, error);
			FinishError();
		}
	})
}


function FinishExp(){
	document.getElementById("survey").style.display="none";
	document.getElementById("experiment_finished").style.display="block";
	document.getElementById("give_ID").innerHTML="Your reference code is:  "+myABI;
	document.getElementById("finish_info").innerHTML="Please write your reference code in Mturk and then close this window. Thanks so much!"
}

function FinishError(){
	document.getElementById("give_ID").innerHTML="Your reference code is:  "+myABI;
	document.getElementById("finish_info").innerHTML="<span style='color: red'>Error: the data might not upload to database successfully. Please contact the experimenter.</span>"
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}


function ipcheck () {
	console.log('test');

	jQuery.ajax({
		url: 'static/php/check_id.php',
		type:'POST',
		success:function(data)
		{
			if (data==1)
			{
				Oops();
			} else if (data==0)
			{
			} else {
				alert('answer was not 1 or 0!');
			}
			
		},
		error:function()
		{
			alert('failed to connect to ip')
		}
		//var result_str:String = event.target.data.toString();
 		//id_check = Number(result_str);		
 		//trace(id_check);

	})
}

function Oops(){
	document.getElementById('ins_pre').innerHTML="Unfortunately, you cannot do this experiment because you (or someone in your household) have participated in this experiment or a similar experiment before. Please close the window. Thank you!"
	document.getElementById('ins_forward').style.display="none";
}

function SurveyClick(){
	if (document.getElementById("gender_unselected").selected|document.getElementById("engaging_unselected").selected|document.getElementById("difficult_unselected").selected|document.getElementById("age").value==""){
	}else{
		document.getElementById("survey_submit").disabled=false;
	}
}

// For offline running
// download(JSON.stringify(data), 'data.txt', '"text/csv"');
// function download(content, fileName, contentType) {
//   var a = document.createElement("a");
//   var file = new Blob([content], {type: contentType});
//   a.href = URL.createObjectURL(file);
//   a.download = fileName;
//   a.click();
// }