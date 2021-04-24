

#three ways these keywords are chosen/matched:
#1. common known phrases
#2. sentence openers
#3. previous data

#the following dict contains keywords from #1 and #2
#the keywords are the badgenames (so check with the excel sheet and be consistent, else error)
keywords_dict = \
    {'brainstorm': ['this reminds me', 'let\'s discuss', 'one way we could start', 'we can approach', 'one approach','i think',
                    'another approach', 'from the video', 'initial idea', 'one idea', 'another idea',
                    'one way', 'another way', 'one way we could start this problem','what strategy'],
     'critique': ['your answer is wrong', 'what evidence', 'answer misses', 'missing', 'doesn\'t seem your answer', 'unless', 'convinced'],
     'elaborate': ['since','this reminds me', 'in my opinion', 'an example', 'explanation', 'perspective', 'because', 'because of', 'for example'],
     'share': ['I feel the same way', 'this reminds me', 'in my opinion', 'clarification', 'clarify', 'share my thoughts', 'we may consider','i think',
               'can someone'],
     'challenge': ['your answer is wrong','what if', 'on the contrary', 'an alternative way', 'instead','what do you think', 'do you agree','do you disagree','is this'],
     'feedback': ['Maybe', 'either', 'another thing to consider', 'I\'d like to suggest', 'suggestion', 'feedback', 'next time',
                  'sugesting', 'disagree with your approach', 'should', 'can', 'supposed to'],
     'addon': ['this reminds me', 'add on', 'in addition', 'furthermore', 'moreover', 'an alternative approach', 'sharing an example'],
     'summarize': ['in summary', 'to summarize', 'summarizing', 'combine our approach', 'combine our opinion', 'in your opinion', 'based on the discussion',
                   'based on our discussion', 'based on this discussion'],
     'answer': ['this reminds me', 'to answer your question', 'I understand what you said', 'I noticed you mentioned', 'you said', 'because'],
     'reflect': ['I feel the same way', 'have to agree', 'have to disagree', 'in my opinion', 'I agree', 'I disagree', 'i kind of agree',
                 'your answer made me wonder', 'wondering', 'if I understood correctly', 'you mean'],
     'assess': ['is this the same as', 'have you consider', 'have I consider', 'are you saying', 'is this'],
     'participate': ['I think' , 'my answer is', 'why do we do'], # post length greater than 10,
     'appreciate': ["thank you", "thanks", "good job", "great job", "great work",'that helped when you .. ',
                    'like it', 'love it', 'cool work', 'really good', 'like how you'],
     'encourage': ['brilliant work', 'great job', 'I liked how','it is fine','i like', 'like it','like how you']
     }

week1_relevance = [];

import re
import string
from dialog_tag import DialogTag
import random

model = DialogTag('distilbert-base-uncased')

class utteranceClassifier():
    def classifierMethod(self, message):

        rewardType = ''
        postTag = model.predict_tag(message)


        if postTag == 'Wh-Question' or postTag == 'Open-Question' or postTag == 'Rhetorical-Question' or postTag == 'Yes-No-Question':
            rewardType = 'Question'
        elif postTag == 'Action-directive':
            rewardType = 'Feedback'
        elif postTag == 'Appreciation':
            rewardType = 'Appreciate'
        elif postTag == 'Conventional-closing':
            rewardType = 'Social'
        elif postTag == 'Agree/Accept':
            rewardType = 'Transactive'

        print('utteranceclassifier.py line 61 :: ', rewardType, len(message))


        temp = rewardType
        reward_list = ['Question', 'Feedback', 'Appreciate', 'Social', 'Transactive']


        elab_list = ['since','this reminds me', 'in my opinion', 'an example', 'explanation', 'perspective', 'because', 'because of', 'for example']
        summarize_list = ['in summary', 'to summarize', 'summarizing', 'combine our approach', 'combine our opinion', 'in your opinion', 'based on the discussion',
                   'based on our discussion', 'based on this discussion']
        addon_list = ['this reminds me', 'add on', 'in addition', 'furthermore', 'moreover', 'an alternative approach',
         'sharing an example']
        brainstorm_list = ['this reminds me', 'let\'s discuss', 'one way we could start', 'we can approach', 'one approach',
                       'i think',
                       'another approach', 'from the video', 'initial idea', 'one idea', 'another idea',
                       'one way', 'another way', 'one way we could start this problem', 'what strategy'],
        if temp not in reward_list or rewardType == 'Statement-non-opinion':
            # check for elaboration
            # for each keywords in the elab_list, check if the keyword is present in the user message
            for elem in elab_list:
                #check if length of the message is less than 7, then does not quality for elaboration
                if len(message.split()) < 7:
                    print('length less than 7, no reward')
                    break;
                if elem.lower() in message.lower():
                    rewardType = 'Elaboration'
                    break;
            #check for summarize
            for elem in summarize_list:
                #check if length of the message is less than 7, then does not quality for summarization
                if len(message.split()) < 7:
                    print('length less than 7, no reward')
                    break;
                if elem.lower() in message.lower():
                    rewardType = 'Summarize'
                    break;
            # check for addon
            for elem in addon_list:
                # check if length of the message is less than 7, then does not quality for summarization
                if len(message.split()) < 7:
                    print('length less than 7, no reward')
                    break;
                if elem.lower() in message.lower():
                    rewardType = 'Addon'
                    break;
            # check for brainstorm
            for elem in addon_list:
                # check if length of the message is less than 7, then does not quality for summarization
                if len(message.split()) < 7:
                    print('length less than 7, no reward')
                    break;
                if elem.lower() in message.lower():
                    rewardType = 'Addon'
                    break;


        print('utteranceclassifier.py line 74 :: ', rewardType)


        praise_messages_part1_list = ['Very Good!', 'Well Done!', 'Way to go!', 'Wonderful!', 'Great Effort!', 'Nice One!'];
        praise_messages_part1 = random.choice(praise_messages_part1_list);

        # the keywords are the badgenames (so check with the excel sheet and be consistent, else error)
        praise_message_part2_dict = \
            {
             'question': 'Asking questions helps you to understand better.',
             'elaboration': 'This will benefit your help-giving skills.',
             'summarize': 'Summarizing is a great skill.',
             'feedback': 'Your feedback to others is highly appreciated!',
             'addon': 'Adding to an existing conversation is useful.',
             'transactive': 'Responding to others is a great way of learning.',
             'brainstorm': 'This will help you to understand better.',
             'appreciate': 'Appreciating others encourages collaboration.',
             'social': 'You are doing a great job!',


             }

        # praised text generated randomly
        if rewardType:
            print(rewardType)
            praiseText = praise_messages_part1 +' '+praise_message_part2_dict[rewardType.lower()];
        else:
            praiseText = "empty"
        return rewardType, praiseText; #returns to broadcaseImageComment


if __name__ == "__main__":
    #keywordMatch.matchingMethod(None, "Good job", "appreciate");
    utteranceClassifier.classifierMethod(None, "I would like to add on to that.");
