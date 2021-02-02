// DOM elements
const btns = document.querySelectorAll('button');
const form = document.querySelector('form');
const formAct = document.querySelector('form span');
const input = document.querySelector('input');
const error = document.querySelector('.error');

var team = 'Gryffindor';

btns.forEach(btn => {
    btn.addEventListener('click', e => {

        //get team
        team = e.target.dataset.team;

        // remove and add active class
        btns.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        // set id of input field
        input.setAttribute('id', team);
    
        // set text of form span
        formAct.textContent = team;

        // call the update function
        update(data);

    })
});


// form submit
form.addEventListener('submit', e => {
    // prevent default action (reload page)
    e.preventDefault();

    // TODO: error message if a string value is entered
    //  this will probably have to be a try catch
    var steps = parseInt(input.value);
     
    // if there is an entry for todays date already update the number
    // of steps by summing steps already entered with steps just entered 
    if(steps && totalSteps > 0){

        combinedSteps = steps + totalSteps;
        dayEntries += 1; 

        db.collection('step_competition').doc(updateID).update({'steps': combinedSteps, 'entries':dayEntries}).then(() => {
            error.textContent = '';
            input.value = '';
            teamID = team;
            // reset this with form.reset
            updateTeamData(steps, teamID);
        
        })




    // else if steps have not been entered today then create a new entry
    // with the value just entered
    } else if (steps && totalSteps == 0) {
        db.collection('step_competition').add({
            steps, 
            team,
            date: new Date().toString(),
            entries: 1
            
        }).then(() => {
            error.textContent = '';
            input.value = '';
            teamID = team;
            // reset this with form.reset
            updateTeamData(steps, teamID);
        })

    // 
    } else {
        error.textContent = 'Please enter a valid number of steps'
    }
});

   // added teh c before the x's because x is defined for the graph
   function addCommas(nStr)
   {
     nStr += '';
     cx = nStr.split('.');
     cx1 = cx[0];
     cx2 = cx.length > 1 ? '.' + cx[1] : '';
     var rgx = /(\d+)(\d{3})/;
     while (rgx.test(cx1)) {
       cx1 = cx1.replace(rgx, '$1' + ',' + '$2');
     }
     return cx1 + cx2;
   }



