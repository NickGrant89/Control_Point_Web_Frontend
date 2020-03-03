$(document).ready(function(){
    $('.delete-device').on('click', function(e){
        $target = $(e.target);
        const id = $target.attr('data-id');
        var delDevice =  confirm('Are you sure you want to delete this device?');
        if(delDevice == true){
            $.ajax({
                type:'DELETE',
                url: '/devices/'+id,
                success: function(response){
                 alert('Device Deleted');
                 window.location.href='/'
                },
                error: function(err){
                       console.log(err); 
                }
            });
        }
        else{
           
        }

    });
});
;

    //Get single relay.

$(document).ready(function(){
    $('.editDevice').on('click', function(e){
        $target = $(e.target);
        const id = $target.attr('data-id');
        const id2 = $target.attr('data-title');
            console.log(id2);
            $.ajax({
                type:'GET',
                //data: dataJson,
                url: '/controlpoint/devices/'+id + '/'+id2,
                dataType: "json",
                contentType: "application/json",
                success: function(response){
                    console.log(response);
                    //  var h = response._id;
                    $("#Id").val(response._id);
                    $("#deviceId").val(response.deviceId);
                    $("#decription").val(response.decription);
                    $("#deviceType").val(response.deviceType);
                    //$("#deviceType").val("eXpert");
                    $("#ipAddress").val(response.ipAddress);
                    $("#subnetMask").val(response.subnetMask);
                    $("#gateway").val(response.defaultGateway);
                    $("#primaryDns").val(response.primaryDns);

                },
                error: function(err){
                        console.log(err); 
                },     
            });
    });
});

  //Get single relay.

  $(document).ready(function(){
    $('.updateDevice').on('click', function(e){
        $target = $(e.target);
            var id = $("#Id").val();
            var id2 = $("#Id2").val();
            console.log(id2);
            var delDevice =  confirm('Are you sure you want to delete this device?');
            if(delDevice == true){
            const dataJson = {
                Id : id,
                deviceId : $("#deviceId").val(),
                decription : $("#decription").val(),
                deviceTupe : $("#deviceType").val(),
                 //$("#deviceType").val("eXpert");
                ipAddress : $("#ipAddress").val(),
                subnetMask : $("#subnetMask").val(),
                defaultGateway : $("#gateway").val(),
                primaryDns :$("#primaryDns").val(),
            };
            
            $.ajax({
                type:'POST',
                data: JSON.stringify(dataJson),
                url: '/controlpoint/devices/'+id+'/'+id2,
                dataType: "json",
                contentType: "application/json",
                success: function(response){
                alert('Device Updated');
                 window.location.href='/'
                
                 

                },
                error: function(err){
                       console.log(err); 
                },
                
            });
        }
  
    });
  });