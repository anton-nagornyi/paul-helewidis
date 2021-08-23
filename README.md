# Paul Helewidis

This is the implementation of the required bulk service.

## Installation

```shell script
npm install
npm run dev.start

curl --location --request POST 'localhost:3000/bulk2' \
--header 'Content-Type: application/json' \
--data-raw '{
    "url": "https://guesty-user-service.herokuapp.com/user/{userID}",
    "verb": "PUT",
    "body": {
        "age": 40
    },
    "payload": [
        {
            "variables": {
                "userID": 22
            }
        },
        {
            "variables": {
                "userID": 33
            }
        },
        {
            "variables": {
                "userID": 54
            }
        }
    ]
}'
``` 

## Considerations
* Rate limiting implementation requires an active Redis server. It was replaced with RedisMock
to keep all the things as simple as possible. This mock just pretends to be a Redis client and
even does not follow redis function signatures.

* To test please use `POST localhost:3000/bulk`

* There is a connected request validator to the `bulk` endpoint, so you won't make a mistake while 
composing your test requests. Consider the following request body example anyway:
```json
{
    "url": "https://guesty-user-service.herokuapp.com/user/{userID}",
    "verb": "PUT",
    "body": {
        "age": 40
    },
    "payload": [
        {
            "variables": {
                "userID": 22
            }
        },
        {
            "variables": {
                "userID": 33
            }
        },
        {
            "variables": {
                "userID": 54
            }
        }
    ]
}
```
* You should get response in the next format:
```json
{
    "invocations": [
        {
            "status": 200
        },
        {
            "status": 200
        },
        {
            "status": 200
        }
    ],
    "summary": {
        "success": 3,
        "fail": 0,
        "total": "100.00%"
    }
}
```
Here consider `summary` section. `success` and `fail` stand for the amount of succeeded and failed
requests respectively. And `total` is the rate of the successful requests.

* Code is not heavily commented because I did not find enough confusing places in it. For sure I might be wrong
with this statement but I hope everything should be quite clear for you.   

* Project is not production ready as it misses `build` script into `javascript`. It is not recommended
to run `typescript` on prod.

* All security issues were not considered at all in this implementation as it is only for testing purposes.
For example I would include `helmet` at least in a real app. 
