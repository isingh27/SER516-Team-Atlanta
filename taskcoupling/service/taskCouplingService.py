import logging
import re

from taigaApi.task.getTasks import TaskFetchingError, get_custom_attribute_values_from_task, get_task_custom_attribute_type_id, get_tasks


def get_task_coupling(project_id, auth_token):
    result = {}
    task_ref_map={}

    tasks = []
    nodes = []
    edges = []

    try:
        custom_attribute_name = "DependsOn"
        
        tasks = get_tasks(project_id, auth_token)
        custom_attribute_type_id = get_task_custom_attribute_type_id(project_id, auth_token, custom_attribute_name)

        if tasks and len(tasks)>0:
            for task in tasks:
                task_ref_map[task['ref']] = task['id']

            for task in tasks:
                task_obj={}
                task_obj['id'] = task['id']
                task_obj['label'] = task['ref']
                task_obj['title'] = task['subject']
                nodes.append(task_obj)

                logging.info(f"task id :{task['id']}")         
                logging.info(f"task subject :{task['subject']}")               
      
                depends_on_values=[]
                custom_attribute_data = get_custom_attribute_values_from_task(task['id'], auth_token)

                logging.info(f"custom attribute data : {custom_attribute_data}")
                logging.info(f"custom attribute type id : {custom_attribute_type_id}")


                if(custom_attribute_type_id in custom_attribute_data):
                    depends_on_str = custom_attribute_data[custom_attribute_type_id]
                    depends_on_values = re.findall(r"#(\d+)", depends_on_str)

                for depends_on in depends_on_values:
                    edge = {}
                    edge['from'] = task['id']
                    edge['to'] = task_ref_map[int(depends_on)]
                    edges.append(edge)
                
        result['nodes'] = nodes
        result['edges'] = edges
        return result

    except TaskFetchingError as e:
            print("Error fetching tasks: {e}")
            return None

    except Exception as e:
        print("Unexpected error calculating cost:")
        return None
