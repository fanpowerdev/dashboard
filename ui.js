var walletInit = false;
var walletAddress = null;

$( document ).ready(function() {

    $(".view").hide();
    console.log( "ready!" );

    $("#initWallet").on("click",function(){
        console.log("Init wallet");
        var pKey = $('#privateKey').val();
        if(pKey.length < 1){
            alert("Input something!")
        }
        else{
            //e3e39f7641fbba22e4e12038b4e1e37cbf9972547e187dd2494914d99beb5be6
            //3a6ea7992eb879796d002c1232128ba2a6a00657a240df1cfe1176f47e0e2f1e
            initWeb3(pKey, function onDone(address){
                walletAddress = address;
                upDateBalance()
            });
        }
    })

    function upDateBalance(){
        getMaticBalance(function(data){
            console.log("Balance is",data);
        let fundLink = ""
        if(data < 0.02)
        fundLink = '  <a href="https://faucet.polygon.technology/" target="_blank"> Fund your wallet</a>';
        else
        fundLink = "";
        fundLink = `<br/><button type="button" id="fundWalletMatic" class="btn btn-warning mt-4"> Fund your wallet with MATIC</button> <br/> <span style="font-size:12px;"> Don't get greedy! </span>`;
        sendLink = `<br/><br/> Send MATIC to someone!  <input type="text" class="form-control mt-2 w-50" id="sendMaticTo"  placeholder="Enter Wallet Address">
        <input type="text" class="form-control mt-2 w-50" id="sendMaticAmount"  placeholder="Enter Amount"> 
        <button type="button" id="sendWalletMatic" class="btn btn-warning mt-4"> Send MATIC</button> <br/>`;
     
        $("#walletDetails").html("Your wallet address is "+ walletAddress+" and has "+ data+ " MATIC"+fundLink+sendLink);
        $(".view").show();

        walletInit = true;
        })
    }
    $("#getContests").on("click",function(){
        $("#contestBody").html("Loading.....");
        getAllContests(function(contests){
            $("#contestBody").html("")
            console.log(contests, contests.length);

            $.each(contests, function(key,value){
                var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
                d.setUTCSeconds(value.deadline);
                $("#contestBody").append(`
                <tr>
                <th scope="row">`+key+`</th>
                <td>`+value.contestData+`</td>
                <td>`+value.betSize+`</td>
                <td>`+value.deadline+`  <hr/> Converted : `+d+`</td>
              </tr>
                
                `);

                
            });


        });
    })


    $("#getTeams").on("click",function(){
        $("#teamBody").html("Loading.....");
        getAllTeams(function(teams){
            $("#teamBody").html("");
            console.log(teams, teams.length);

            $.each(teams, function(key,value){
                var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
                d.setUTCSeconds(value.registerTime);
                $("#teamBody").append(`
                <tr>
                <th scope="row">`+key+`</th>
                <td>`+value.contestId+`</td>
                <td>`+value.betAmount+`</td>
                <td>`+value.team+` </td>
                <td>`+value.player+` </td>
                <td>`+value.registerTime+`  <hr/> Converted : `+d+`</td>
              </tr>
                
                `);

                
            });


        });
    })

    $("#createContest").on("click",function(){
        var a1 = $('#contest-data').val();
        var a2 = $('#contest-betAmount').val();
        var a3 = $('#contest-deadline').val();

        $("#contestTx").html("");
        if(a1.length < 1 || a2.length < 1 || a3.length < 1){
            alert("Input something!")
        }
        else{
            $("#createContest").text("creating....");
            $("#createContest").prop('disabled', true);
            createContest(a1,a2,a3, function(data){
                $("#createContest").prop('disabled', false);
                $("#createContest").text("Create Contest");
                $("#contestTx").html("Contest created. Click here to view on blockchain <a href='https://mumbai.polygonscan.com/tx/"+data.transactionHash+"'>View </a>")
            }, 
            function(error){
                alert(error);
            });

        }
    })


    $("#createTeam").on("click",function(){
        var a1 = $('#team-contestId').val();
        var a2 = $('#team-data').val();
        var a3 = $('#team-betAmount').val();

        $("#teamTx").html("");
        if(a1.length < 1 || a2.length < 1 || a3.length < 1){
            alert("Input something!")
        }
        else{
            $("#createTeam").text("registering....");
            $("#createTeam").prop('disabled', true);
            createTeam(a1,a2,a3, function(data){
                $("#createTeam").prop('disabled', false);
                $("#createTeam").text("Register Team");
                $("#teamTx").html("Team Registered. Click here to view on blockchain <a href='https://mumbai.polygonscan.com/tx/"+data.transactionHash+"'>View </a>")
            }, 
            function(error){
                alert(error);
            });

        }
    })


    $(document).on("click","#fundWalletMatic",function(){

        $("#fundWalletMatic").prop('disabled', true);
        $("#fundWalletMatic").html('Requesting the \\m/ God!... Have patience!');
        fundMatic(function(data){

            $("#fundWalletMatic").html('Gods have sent gifts!');
            upDateBalance();
            console.log(data);
        },function(errorData){
            alert("Error",errorData);
        })
    })

    $(document).on("click","#sendWalletMatic",function(){

        $("#sendWalletMatic").prop('disabled', true);
        $("#sendWalletMatic").html('Sending with your blesings...');
        sendMatic($("#sendMaticTo").val(),$("#sendMaticAmount").val(), function(data){

            $("#sendWalletMatic").html('Sent!');
            upDateBalance();
            console.log(data);
        },function(errorData){
            alert("Error",errorData);
        })
    })


    
});
