import json



data = open("./all-the-stuff.json")

people = json.load(data)

def get_data(person):
    return {

        "email": person["workEmail"],
        "firstName": person["preferredFirstName"],
        "lastName": person["user_cache"]["name"]["last"],
    }


filtered = [get_data(person) for person in people if person["title"]  == 'BCBA' and person['roleState'] == 'ACTIVE']
print(len(filtered))
print(json.dumps(filtered, indent=4, sort_keys=True))

for person in filtered:
    print(f"""('BCBA', '{person['firstName']}', '{person['lastName']}', '{person['email']}'),""")

