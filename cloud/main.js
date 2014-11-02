require('cloud/app.js');
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});

var survey = {
	'data1':{
		'title':'Ease of opening',
		'options':[
			'Very difficult to open',
	        'Difficult to open',
	        'Neither easy or difficult to open',
	        'Easy to open',
	        'Very easy to open'
        ]
	},
	'data2':{
		'title':'Suitability of packaging type',
		'options':[
			'Very unsuitable',
	        'Unsuitable',
	        'Neither suitable or unsuitable',
	        'Suitable',
	        'Very suitable'
        ]
	},
	'data3':{
		'title':'Clarity of instruction',
		'options':[
			'Very unclear',
	        'Unclear',
	        'Neither clear or unclear',
	        'Clear enough',
	        'Very clear'
        ]
	},
	'data4':{
		'title':'Design user-friendliness',
		'options':[
			'Very unfriendly',
	        'Unfriendly',
	        'Neither friendly or unfriendly',
	        'Friendly',
	        'Very friendly'
        ]
	}
}

Parse.Cloud.define("review", function(request, response) {
	var query = new Parse.Query("Review");
	query.equalTo("objectId", request.params.id);
	query.include("userId");
	query.include("productId");
	query.include("productId.companyId");
	query.find({
		success: function(results) {
			var res = {"error": true};
			if(results.length > 0){
				var object = results[0];
				data1 = parseInt(object.get('data1'));
				data2 = parseInt(object.get('data2'));
				data3 = parseInt(object.get('data3'));
				data4 = parseInt(object.get('data4'));
				data5 = object.get('data5');
				image = object.get('image');
				product = object.get('productId');

				res = {
					"error": false,
					"title": "Review",
					"data1": {
						'title': survey.data1.title,
						'option': survey.data1.options[data1-1],
						'score': data1
					},
					"data2":{
						'title': survey.data2.title,
						'option': survey.data2.options[data2-1],
						'score': data2
					},
					"data3": {
						'title': survey.data3.title,
						'option': survey.data3.options[data3-1],
						'score': data3
					},
					"data4": {
						'title': survey.data4.title,
						'option': survey.data4.options[data4-1],
						'score': data4
					},
					"data5": data5,
					"image": image,
					"ageGroup": object.get('userId').get('ageGroup'),
					"product":{
						'image':product.get('image'),
						'title':product.get('title'),
						'company':product.get('companyId').get('name')
					}
				}
			}
			response.success(res);
		},
		error: function() {
		  response.error("review lookup failed");
		}
	});
});
