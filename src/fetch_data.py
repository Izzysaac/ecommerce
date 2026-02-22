import requests
import json

def fetch_excel_data():
    try:
        response = requests.get('https://opensheet.elk.sh/1oicYVDp3z8KORWBzFOFY4oHvvBHvqWeaZXSkAX3HL3Q/catalog')
        response.raise_for_status()
        data = response.json()
        
        mapped_data = []
        for item in data:
            mapped_item = {
                "categoria": item.get("CATEGORIA", ""),
                "nombre": item.get("NOMBRE", ""),
                "descripcion": item.get("DESCRIPCION", ""),
                "precio": int(item.get("PRECIO", 0)) if item.get("PRECIO") else 0,
                "media": [],
                "estado": item.get("ESTADO", "inactivo")
            }
            
            # Handle MEDIA field - split by ; and clean up
            if item.get("MEDIA"):
                media_items = item["MEDIA"].split(";")
                mapped_item["media"] = [m.strip() for m in media_items if m.strip()]
            
            mapped_data.append(mapped_item)
        
        return mapped_data
        
    except requests.RequestException as e:
        print(f"Error fetching data: {e}")
        return []
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON: {e}")
        return []
    except Exception as e:
        print(f"Unexpected error: {e}")
        return []

def save_to_json(data, output_path):
    try:
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"Data saved to {output_path}")
    except Exception as e:
        print(f"Error saving file: {e}")

if __name__ == "__main__":
    data = fetch_excel_data()
    if data:
        save_to_json(data, "../public/data.json")
    else:
        print("No data to save")
