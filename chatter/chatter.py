from gradio_client import Client, handle_file


explainer_client = Client("http://private-gpt.avena.ddns.net/")
# wandering_client = Client("http://192.168.1.155:8001/")
wandering_client = Client("http://private-gpt.avena.ddns.net/")

explainer_persona = "Eres un experto en cloud computing que responde a las preguntas de manera amistosa y mencionando todos los conceptos técnicos que aparecen en el libro de cloud computing. haces preguntas a tu interlocutor para que te dé más contexto."

wandering_persona = "Eres el dueño de una empresa de importación que necesita expandir su empresa implementando cloud computing, tienes mucho miedo de esta nueva tecnologia, respondes a las preguntas de tu interlocutor explicando experiencias que le han pasado a tus clientes y pides más información sobre los conceptos técnicos que te mencionan"

# result = explainer_client.predict(
# 		api_name="/_list_ingested_files"
# )


# result = explainer_client.predict(
# 		mode="RAG",
# 		api_name="/_set_current_mode"
# )


for tema in range(1, 43):

	wandering_client.predict(system_prompt_input=wandering_persona,	api_name="/_set_system_prompt")

	print(f"\n\nTema: {tema}\n\n")
	wandering_question = wandering_client.predict(
			message=f"explica a tu interlocutor los puntos clave del tema {tema}, centrandote en los riesgos y los problemas y hazle las preguntas sobre el tema",
			mode="RAG",
			param_3= [handle_file('../input_data/libro de cloud computing.txt')],
			param_4="",
			api_name="/chat"
	).split("<hr>")[0]

	print("\n\nPregunta:\n\n")
	print(wandering_question)
 
	explainer_client.predict(system_prompt_input=explainer_persona,	api_name="/_set_system_prompt")

	explainer_response = explainer_client.predict(
			message=f"explica a tu interlocutor los conceptos técnicos del tema {tema}, intentando responder a las siguientes preguntas: {wandering_question}",
			mode="RAG",
			param_3= [handle_file('../input_data/libro de cloud computing.txt')],
			param_4="",
			api_name="/chat"
	).split("<hr>")[0]


	print("\n\nRespuesta:\n\n")
	print(explainer_response)
