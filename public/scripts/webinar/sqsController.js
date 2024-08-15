
  
  // Create an SQS service object

  
export const sqsController = (function(){

var sqs = new AWS.SQS({
    apiVersion: "2012-11-05"
    });


    function sendMessageToSqs(message){
        // Define the parameters for calling createQueue
            const params = {
                MessageBody: JSON.stringify(message),
                QueueUrl: 'https://sqs.us-east-1.amazonaws.com/557462211774/WebinarErrorQueue'
            };

            // Send the message
            sqs.sendMessage(params, function(err, data) {
            if (err) {
                console.log('Error', err);
            } else {
                console.log('Success', data.MessageId);
            }
            });
    }

    return {
        sendMessageToSqs
    }

})()

export default sqsController;