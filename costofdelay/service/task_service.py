from datetime import datetime, timedelta
from itertools import groupby
import logging
import re
from taigaApi.milestone.getMilestoneById import MilestoneFetchingError, get_milestone_by_id
from taigaApi.issue.getIssuesByProjectId import get_issues_by_project_id
from taigaApi.issue.getCustomAttributeValueByIssueId import get_custom_attribute_value_by_issue_id, get_custom_attribute_type_id_for_issue
from taigaApi.userStory.getUserStory import get_userstories_by_sprint, get_custom_attribute_from_userstory, get_custom_attribute_type_id
import threading
import redis
import json

r_task = redis.StrictRedis(host='localhost', port=6379, db=1)

def get_cost_of_delay_for_sprint(project_id, sprint_id, business_value_cost_factor, auth_token):
     
    issue_list = get_issues_by_project_id(project_id, auth_token)

    sprint_issue_list = []

    for issue in issue_list :
        if issue['milestone'] == sprint_id :
            sprint_issue_list.append(issue)

    response_userstory = {}
    response_business_value = {}
    response_cost_of_delay = {}

    sprint_data = get_milestone_by_id(sprint_id, auth_token)

    response_userstory["0"] = 0
    response_business_value["0"] = 0
    response_cost_of_delay["0"] = 0

    start_date = sprint_data['estimated_start']
    end_date = sprint_data['estimated_finish']

    start_date = datetime.strptime(start_date, "%Y-%m-%d")
    end_date = datetime.strptime(end_date, "%Y-%m-%d")

    for date in range((end_date - start_date).days+1):
        current_date = start_date+timedelta(days = date)
        response_userstory[current_date.strftime("%Y-%m-%d")] = 0
        response_business_value[current_date.strftime("%Y-%m-%d")] = 0
        response_cost_of_delay[current_date.strftime("%Y-%m-%d")] = 0

    custom_attribute_type_id = get_custom_attribute_type_id_for_issue(project_id, auth_token, "blocked")

    dependencies = {}
    issue_data = {}

    issue_date_map = {}

    for issue in sprint_issue_list :
        issue_id = issue['id']
        issue_date_map[issue_id] = {}
        issue_date_map[issue_id]['created_date'] = issue['created_date']
        issue_date_map[issue_id]['finished_date'] = issue['finished_date']

        custom_attribute_value_for_issue = get_custom_attribute_value_by_issue_id(issue_id, custom_attribute_type_id, auth_token)
        issue_data[issue_id] = issue
        issue_dependency_story_list = [x.strip() for x in custom_attribute_value_for_issue.split(',')] 
        dependencies[issue_id] = issue_dependency_story_list

    userstory_ref_map={}

    user_stories = get_userstories_by_sprint(sprint_id, auth_token)
    if user_stories and len(user_stories)>0 :
        for userstory in user_stories :
            userstory_ref = '#' + str(userstory['ref'])
            userstory_ref_map[userstory_ref] = userstory

    userstory_blocker_map = {}

    for dependency_key, dependency_value in dependencies.items() :
        for userstory_label in dependency_value :
            if userstory_label in userstory_ref_map:
                userstory = userstory_ref_map[userstory_label]
                userstory_id = userstory['id']
                
                if userstory_id in userstory_blocker_map :
                    userstory_blocker_map[userstory_label]['blocked_start_date'] = min(userstory_blocker_map[userstory_label]['blocked_start_date'], issue_date_map[dependency_key]['created_date'])
                    if issue_date_map[dependency_key]['finished_date'] != None :
                        userstory_blocker_map[userstory_label]['blocked_end_date'] = max(userstory_blocker_map[userstory_label]['blocked_end_date'], issue_date_map[dependency_key]['finished_date'])
                    else :
                        userstory_blocker_map[userstory_label]['blocked_end_date'] = None
                else :
                    userstory_blocker_map[userstory_label] = {}
                    userstory_blocker_map[userstory_label]['blocked_start_date'] = issue_date_map[dependency_key]['created_date']
                    userstory_blocker_map[userstory_label]['blocked_end_date'] = issue_date_map[dependency_key]['finished_date']

    for userstory_key, userstory_value in userstory_blocker_map.items() :
        userstory = userstory_ref_map[userstory_key]
        userstory_id = userstory['id']
        
        if userstory_value['blocked_start_date'] > sprint_data['estimated_start'] :
            custom_attribute_data = get_custom_attribute_from_userstory(userstory_id, auth_token)
            custom_attribute_type_id = get_custom_attribute_type_id(project_id, auth_token, "Business Value")

            issue_start_date = userstory_value['blocked_start_date']
            issue_end_date = userstory_value['blocked_end_date']
            issue_start_date = datetime.strptime(issue_start_date,"%Y-%m-%dT%H:%M:%S.%fZ")
            if issue_end_date != None :
                issue_end_date = datetime.strptime(issue_end_date,"%Y-%m-%dT%H:%M:%S.%fZ")

            if 'total_points' in userstory and userstory['total_points'] != None:
                response_userstory[issue_start_date.strftime("%Y-%m-%d")] += int(userstory['total_points'])
                if issue_end_date != None :
                    response_userstory[issue_end_date.strftime("%Y-%m-%d")] -= int(userstory['total_points'])
            if custom_attribute_type_id in custom_attribute_data and custom_attribute_data[custom_attribute_type_id] != None:
                response_business_value[issue_start_date.strftime("%Y-%m-%d")] += int(custom_attribute_data[custom_attribute_type_id])
                if issue_end_date != None :
                    response_business_value[issue_end_date.strftime("%Y-%m-%d")] -= int(custom_attribute_data[custom_attribute_type_id])

    response_prev = "0"
    for response_userstory_key, response_userstory_value in response_userstory.items():
        if response_userstory_key != "0":
            response_userstory[response_userstory_key] += response_userstory[response_prev]
            response_business_value[response_userstory_key] += response_business_value[response_prev]
            response_cost_of_delay[response_userstory_key] += ((business_value_cost_factor * response_business_value[response_userstory_key]) + response_cost_of_delay[response_prev])
            response_prev = response_userstory_key

    response = {}

    response['userstory'] = response_userstory
    response['business_value'] = response_business_value
    response['cost_of_delay'] = response_cost_of_delay

    return response
