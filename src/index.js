/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npx wrangler dev src/index.js` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npx wrangler publish src/index.js --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import {
	InteractionResponseType,
	InteractionType,
	verifyKey,
} from 'discord-interactions';

import { MATH_COMMAND} from "./commands";

class JsonResponse extends Response {
	constructor(body, init) {
		const jsonBody = JSON.stringify(body);
		init = init || {
			headers: {
				'content-type': 'application/json;charset=UTF-8',
			},
		};
		super(jsonBody, init);
	}
}

export default {
	async fetch(request, env, ctx) {
		const signature = request.headers.get('x-signature-ed25519');
		const timestamp = request.headers.get('x-signature-timestamp');
		const body = await request.clone().arrayBuffer();

		console.log(env.DISCORD_PUBLIC_KEY)

		const isValidRequest = verifyKey(
			body,
			signature,
			timestamp,
			env.DISCORD_PUBLIC_KEY
		);

		if (!isValidRequest) {
			return new Response('The request signature is not valid', { status: 401 });
		}

		const message = await request.json();

		if (message.type === InteractionType.PING) {
			return new JsonResponse({
				type: InteractionResponseType.PONG,
			});
		}

		if (message.type === InteractionType.APPLICATION_COMMAND) {
			switch (message.data.name.toLowerCase()) {
				case MATH_COMMAND.name.toLowerCase(): {
					if (message.data.options[0].name == 'add_numbers') {
						const first_number = message.data.options[0].options[0].value
						const second_number = message.data.options[0].options[1].value
						const total = first_number + second_number

						return new JsonResponse({
							type: 4,
							data: {
								content: `${first_number} + ${second_number} = ${total}`,
							},
						});
					}
				}
			}
		}
	},
};
