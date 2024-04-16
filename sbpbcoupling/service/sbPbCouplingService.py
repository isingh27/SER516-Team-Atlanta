from taigaApi.userStory.getUserStory import UserStoryFetchingError, get_custom_attribute_from_userstory,get_userstories_by_sprint,get_custom_attribute_type_id,get_user_story
import re
import logging
def get_sb_coupling(sprint_id, auth_token):
    result ={}
    userstory_ref_map={}
    
    nodes = []
    edges = []
    user_stories = []

    try:
        custom_attribute_name = "DependsOn"

        user_stories = get_userstories_by_sprint(sprint_id, auth_token)
        custom_attribute_type_id = get_custom_attribute_type_id(user_stories[0]['project'], auth_token, custom_attribute_name)
        
        if user_stories and len(user_stories)>0:
            for userstory in user_stories:
                userstory_ref_map[userstory['ref']] = userstory['id']
           
            for userstory in user_stories:
                user_story_obj={}
                user_story_obj['id'] = userstory['id']
                user_story_obj['label'] = userstory['ref']
                user_story_obj['title'] = userstory['subject']
                nodes.append(user_story_obj)

                logging.info(f"userstory id :{userstory['id']}")         
                logging.info(f"userstory subject :{userstory['subject']}")               
      
                depends_on_values=[]
                custom_attribute_data = get_custom_attribute_from_userstory(userstory['id'], auth_token)

                logging.info(f"custom attribute data : {custom_attribute_data}")
                logging.info(f"custom attribute type id : {custom_attribute_type_id}")


                if(custom_attribute_type_id in custom_attribute_data):
                    depends_on_str = custom_attribute_data[custom_attribute_type_id]
                    depends_on_values = re.findall(r"#(\d+)", depends_on_str)

                for depends_on in depends_on_values:
                    edge = {}
                    edge['from'] = userstory['id']
                    edge['to'] = userstory_ref_map[int(depends_on)]
                    edges.append(edge)
                
        result['nodes'] = nodes
        result['edges'] = edges
        return result


    except UserStoryFetchingError as e:
        print(f"Error fetching UserStories: {e}")
        return None  

    except Exception as e:
        print(f"Unexpected error :{e}")
        return None
    


def get_pb_coupling(project_id, auth_token):
    result = {}
    userstory_ref_map={}

    user_stories = []
    nodes = []
    edges = []

    try:
        custom_attribute_name = "DependsOn"
        user_stories = get_user_story(project_id, auth_token)

        if len(user_stories)>0:
            custom_attribute_type_id = get_custom_attribute_type_id(user_stories[0]['project'], auth_token, custom_attribute_name)

            for user_story in user_stories:
                userstory_ref_map[user_story['ref']] = user_story['id']

            for user_story in user_stories:
                if(user_story['milestone']==None):
                    user_story_obj = {}
                    user_story_obj['id'] = user_story['id']
                    user_story_obj['label'] = user_story['ref']
                    user_story_obj['title'] = user_story['subject']

                    nodes.append(user_story_obj)
                    custom_attribute_data = get_custom_attribute_from_userstory(user_story['id'], auth_token)
                
                    if(custom_attribute_type_id in custom_attribute_data):     
                        depends_on_str = custom_attribute_data[custom_attribute_type_id]
                        depends_on_values = re.findall(r"#(\d+)", depends_on_str)

                        for depends_on in depends_on_values:
                            edge = {}
                            edge['from'] = user_story['id']
                            edge['to'] = userstory_ref_map[int(depends_on)]
                            edges.append(edge)

        result['nodes'] = nodes
        result['edges'] = edges                   
        return result

    except UserStoryFetchingError as e:
        print(f"Error fetching UserStories: {e}")
        return None
         
    except Exception as e :
        print(f"Unexpected error :{e}")
        return None