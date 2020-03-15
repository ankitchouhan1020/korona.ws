
# Coronavirus India map

Shows map of coronavirus spread across India. Displays confirmed cases and death statistics in each state. Source : [https://www.mohfw.gov.in/](https://www.mohfw.gov.in/)


## Contribute

* [Install node](https://nodejs.org/en/download/)
* [Install yarn]([https://classic.yarnpkg.com/en/docs/install/#debian-stable](https://classic.yarnpkg.com/en/docs/install/#debian-stable))
* [Fork the repo](https://guides.github.com/activities/forking/#fork)
* Clone your repo
```
$ cd corona
$ yarn installs
$ yarn start
```

## Firebase Database Sample

```json
{
	"cases" : [
		{	
			"city":"Delhi",
			"count":7,
			"date":"2020-03-15",
			"source":"https:\/\/www.mohfw.gov.in\/"
		},
	],
	"cities" : [
		{
			"name":"Andaman And Nicobar",
			"location":[ 11.66702557,92.73598262]
		}
	],
	"deaths" : [
		{
			"city":"Delhi",
			"count":1,
			"source":"https://www.bbc.com/news/world-asia-india-51866903",
			"date":"2020-03-13"
		}
	],
	"cures" : [
		{
			"city":"Delhi",
			"count":2,
			"source":"https://www.bbc.com/news/world-asia-india-51866903",
			"date":"2020-03-13"
		}
	],
	"hospitalizations":[
		{
			"date" : "2020-03-13",
			"count": 522
		}
	],
	"quarantines":[
		{
			"date" : "2020-03-13",
			"count": 415
		}
	],
	"supervisions":[
		{
			"date" : "2020-03-13",
			"count": 42296
		}
	],
	"tests":[
		{
			"date" : "2020-03-13",
			"count": 1229363
		}
	],
}
```